const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

class DynamoDBService {
  constructor(tableName) {
    this.dynamoClient = new DynamoDBClient({ region: "us-east-1" });
    this.tableName = tableName;
  }

  async saveMessage(messageId, body) {
    const params = {
      TableName: this.tableName,
      Item: {
        messageId: { S: messageId },
        body: { S: body },
        timestamp: { S: new Date().toISOString() },
      },
    };
    return await this.dynamoClient.send(new PutItemCommand(params));
  }
}

module.exports = DynamoDBService;
