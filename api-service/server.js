import express from "express";
import userRouter from "./routes/user.routes.js";
import dbConnect from "./utils/dbConnect.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";
import {connectRedis} from "./utils/redisClient.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api/v1/users", userRouter);


app.listen(PORT, async () => {
  await dbConnect();
  await connectRabbitMQ();
  await connectRedis();
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
