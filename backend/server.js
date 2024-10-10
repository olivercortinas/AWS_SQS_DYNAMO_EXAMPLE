const express = require("express");
const SQSService = require("./services/SQSService");
const DynamoDBService = require("./services/DynamoDBService");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());

const sqsService = new SQSService(
  process.env.SQS_QUEUE_URL
);
const dynamoDBService = new DynamoDBService(process.env.DYNAMODB_TABLE_NAME);

app.use(express.json());

app.post("/send-process", async (req, res) => {
  try {
    const { message } = req.body;
    const result = await sqsService.sendMessage(message);
    res.status(200).json({ status: "Enviado", messageId: result.MessageId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error enviando el proceso" });
  }
});

app.get("/receive-process", async (req, res) => {
  try {
    const message = await sqsService.receiveMessage();
    if (message) {
      await dynamoDBService.saveMessage(message.MessageId, message.Body);
      await sqsService.deleteMessage(message.ReceiptHandle);
      res.status(200).json({ status: "Procesado", message });
    } else {
      res.status(404).json({ status: "No hay procesos nuevos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error recibiendo el proceso" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
