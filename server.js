import { Worker } from "bullmq";
import { redisConnection } from "./config/redis";
import { processTransaction } from "./workers/transaction.worker";

dotenv.config({ path: "./.env" });
const app = require("./app");

const worker = new Worker("transactions", processTransaction, {
  connection: redisConnection,
  concurrency: 10,
});

worker.on("completed", (job) => {
  console.log(`✅ Transaction ${job.id} processed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Transaction ${job?.id} failed`, err.message);
});

console.log("🚀 Transaction worker started");
