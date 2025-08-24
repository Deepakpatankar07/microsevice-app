import mongoose from "mongoose";
import Data from "./models/data.models.js";
import dotenv from "dotenv";
dotenv.config();

async function seed() {
   const db = process.env.MONGODB_URI || "mongodb://localhost:27017/microservice";
  await mongoose.connect(db);

  await Data.deleteMany({});
  await Data.insertMany([
    { numId: 1, title: "English", content: "Hello" },
    { numId: 2, title: "French", content: "Bonjour" },
    { numId: 3, title: "Spanish", content: "Hola" },
    { numId: 4, title: "Italian", content: "Ciao" },
    { numId: 5, title: "Hindi", content: "नमस्ते" },
    { numId: 6, title: "Portuguese", content: "Olá" },
    { numId: 7, title: "Russian", content: "Привет" },
    { numId: 8, title: "Mandarin", content: "你好" },
    { numId: 9, title: "Arabic", content: "مرحبا" },
    { numId: 10, title: "Japanese", content: "こんにちは" },
  ]);

  console.log("✅ Seeded Data!");
  mongoose.connection.close();
}

seed().catch((err) => console.error(err));
