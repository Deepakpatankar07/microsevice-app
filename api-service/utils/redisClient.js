import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379"
});

redis.on("error", (err) => console.error("Redis Client Error", err));

let isConnected = false;

async function connectRedis() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
    console.log("✅ Connected to Redis");
  }
  return redis;
}

export { connectRedis };
export default redis