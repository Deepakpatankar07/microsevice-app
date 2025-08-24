import amqplib from "amqplib";

let channel;
const queueName = "user_registered";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";

// Retry wrapper
async function createConnection() {
  let retries = 5;
  while (retries) {
    try {
      const connection = await amqplib.connect(RABBITMQ_URL);

      connection.on("error", (err) => {
        console.error("❌ RabbitMQ connection error:", err.message);
      });

      connection.on("close", () => {
        console.warn("⚠️ RabbitMQ connection closed. Retrying...");
        setTimeout(connectRabbitMQ, 5000); // reconnect after 5s
      });

      return connection;
    } catch (err) {
      console.error("❌ Failed to connect to RabbitMQ, retrying in 5s...", err.message);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("❌ Could not connect to RabbitMQ after retries");
}

export const connectRabbitMQ = async () => {
  try {
    const connection = await createConnection();
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ Connected to RabbitMQ");
  } catch (err) {
    console.error("❌ RabbitMQ setup error:", err.message);
  }
};

export const publishToQueue = async (msg) => {
  try {
    if (!channel) {
      console.error("❌ RabbitMQ channel not established");
      return;
    }
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), { persistent: true });
    console.log("📨 Message published to queue:", msg);
  } catch (err) {
    console.error("❌ Error publishing to queue:", err.message);
  }
};
