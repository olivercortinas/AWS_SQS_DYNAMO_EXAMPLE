const express = require('express');
const SQSService = require('./services/SQSService');
const { DynamoDBService } = require('./services/DynamoDBService');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const interval = 5000; // Definir el intervalo en milisegundos

// Inicializar instancias de servicios
const sqsService = new SQSService(process.env.SQS_QUEUE_URL);
const dynamoDBService = new DynamoDBService();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Endpoint para enviar un proceso a la cola de SQS y almacenarlo en DynamoDB con estado "PENDING"
app.post("/send-process", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Falta el mensaje" });
  }
  try {
    // Enviar mensaje a SQS
    console.log("Sending message to SQS", message);
    const result = await sqsService.sendMessage(message);
    const messageId = result.MessageId;

    // Guardar mensaje en DynamoDB con estado "PENDING"
    await dynamoDBService.saveMessage({
      messageId,
      body: message,
      status: "PENDING",
      timestamp: new Date().toISOString(),
    });
    console.log(`Message saved in DynamoDB: ${messageId}`);
    res.status(200).json({ messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error enviando el proceso" });
  }
});

// Endpoint para recibir y procesar mensajes manualmente
app.get("/receive-process", async (req, res) => {
  try {
    console.log("Receiving message from SQS");
    const message = await sqsService.receiveMessage();
    if (message) {
      // Actualizar estado en DynamoDB a "COMPLETED"
      await dynamoDBService.updateMessageStatus(message.MessageId, "COMPLETED");
      console.log(`Message processed: ${message.MessageId}`);
      // Eliminar el mensaje de la cola
      await sqsService.deleteMessage(message.ReceiptHandle);
      console.log(`Message deleted: ${message.MessageId}`);

      res.status(200).json({ status: "Message processed successfully" });
    } else {
      res.status(200).json({ status: "No message to process" });
    }
  } catch (error) {
    console.error("Detailed error: ", error.message);
    res.status(500).json({ error: "Error processing message" });
  }
});

// Endpoint para obtener todos los mensajes almacenados en DynamoDB
app.get("/messages", async (req, res) => {
  try {
    const messages = await dynamoDBService.getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving messages" });
  }
});

// Procesar mensajes de SQS y actualizar su estado en DynamoDB
const processMessages = async () => {
  try {
    const message = await sqsService.receiveMessage();
    if (message) {
      await dynamoDBService.updateMessageStatus(message.MessageId, "COMPLETED");
      await sqsService.deleteMessage(message.ReceiptHandle);
    }
  } catch (error) {
    console.error("Error processing messages", error);
  }
};

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Verificar si se debe procesar mensajes automáticamente
  if (process.env.PROCESS_MESSAGES_AUTOMATICALLY === "true") {
    // Set an interval to process messages every 5 seconds
    // This ensures that messages are processed automatically at regular intervals
    setInterval(processMessages, interval);
  }
});