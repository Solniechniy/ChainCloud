import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient: RedisClientType;

export const initializeRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST || "localhost"}:${
        process.env.REDIS_PORT || "6379"
      }`,
    });

    redisClient.on("error", (err) => {
      console.error("Redis client error:", err);
    });

    await redisClient.connect();
    console.log("Redis connection established");
  } catch (error) {
    console.error("Error initializing Redis connection:", error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

export const cacheData = async (
  key: string,
  data: any,
  expirationInSeconds = 3600
): Promise<void> => {
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: expirationInSeconds,
    });
  } catch (error) {
    console.error(`Error caching data for key ${key}:`, error);
  }
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving cached data for key ${key}:`, error);
    return null;
  }
};
