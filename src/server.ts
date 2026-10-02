import app from "./app";
import { config } from "./config";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! ðŸ’¥ Shutting down...");
  console.log(err, err.name, err.message);
  process.exit(1);
});

const server = app.listen(config.port, () => {
  console.log(`Merchant API running on http://localhost:${config.port}`);
});

// Note: In production you usually run the worker as a separate process.
// For local simplicity you can also import the worker here.
import "./modules/transactions/transaction.worker";

process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
