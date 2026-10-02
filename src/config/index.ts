import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4100", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mysql: {
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root",
    database: process.env.MYSQL_DATABASE || "transactions_db",
  },
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  queueName: "transactions",
  idempotencyTTL: 60 * 60 * 24, // 24 hours
};
