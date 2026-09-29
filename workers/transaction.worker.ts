import { Job } from "bullmq";
import { db } from "../config/database";
import { redis } from "../config/redis";

export async function processTransaction(job: Job) {
  const { transactionId, amount, merchantId } = job.data;

  // Idempotency check
  const alreadyProcessed = await redis.get(`tx:${transactionId}`);
  if (alreadyProcessed) return { status: "already_processed" };

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO transactions (id, amount, merchant_id, status) VALUES (?, ?, ?, ?)`,
      [transactionId, amount, merchantId, "completed"],
    );

    await redis.set(`tx:${transactionId}`, "1", "EX", 86400);
    await connection.commit();

    return { status: "completed" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
