const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");

class SQSService {
  constructor(queueUrl) {
    this.sqsClient = new SQSClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    });
    this.queueUrl = queueUrl;
  }

  async sendMessage(messageBody) {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
      MessageGroupId: "processGroup",
      MessageDeduplicationId: new Date().getTime().toString(),
    };
    return await this.sqsClient.send(new SendMessageCommand(params));
  }

  async receiveMessage() {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
    };
    const data = await this.sqsClient.send(new ReceiveMessageCommand(params));
    return data.Messages ? data.Messages[0] : null;
  }

  async deleteMessage(receiptHandle) {
    const params = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    };
    return await this.sqsClient.send(new DeleteMessageCommand(params));
  }
}

module.exports = SQSService;
