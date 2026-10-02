import Redis from "ioredis";
import { config } from "./index";

export const redisConnection = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null, // required by BullMQ
});
