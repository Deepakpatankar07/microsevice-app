import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const queueName = "user_registered";

async function connectRabbitMQ(retries = 5) {
  while (retries) {
    try {
      const connection = await amqplib.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq");
      return connection;
    } catch (err) {
      console.error("❌ RabbitMQ not ready, retrying in 5s...", err.message);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("❌ Failed to connect to RabbitMQ after retries");
}

const startConsumer = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log("✅ Consumer connected. Waiting for messages...");

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log(`📧 Simulating Welcome Email to: ${data.email}`);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("❌ Consumer fatal error:", err);
  }
};

startConsumer();
