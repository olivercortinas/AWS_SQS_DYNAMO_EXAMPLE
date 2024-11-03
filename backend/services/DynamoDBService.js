const { DynamoDBClient, PutItemCommand, UpdateItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");

class DynamoDBService {
  constructor() {
    this.client = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.tableName = "ASP_Messages_Table"; // Nombre de la tabla que creaste
  }

  // Método para guardar mensaje en DynamoDB
  async saveMessage(message) {
    const params = {
      TableName: this.tableName,
      Item: {
        messageId: { S: message.messageId },
        body: { S: message.body },
        status: { S: message.status },
        timestamp: { S: message.timestamp },
      },
    };
    await this.client.send(new PutItemCommand(params));
  }

  // Método para actualizar el estado del mensaje
  async updateMessageStatus(messageId, status) {
    const params = {
      TableName: this.tableName,
      Key: {
        messageId: { S: messageId },
      },
      UpdateExpression: "set #s = :s",
      ExpressionAttributeNames: {
        "#s": "status",
      },
      ExpressionAttributeValues: {
        ":s": { S: status },
      },
    };
    await this.client.send(new UpdateItemCommand(params));
  }

  // Método para obtener todos los mensajes
  async getAllMessages() {
    const params = {
      TableName: this.tableName,
    };
    const data = await this.client.send(new ScanCommand(params));
    return data.Items.map((item) => ({
      messageId: item.messageId.S,
      body: item.body.S,
      status: item.status.S,
      timestamp: item.timestamp.S,
    }));
  }
}

module.exports = { DynamoDBService };
