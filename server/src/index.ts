import { App } from "./app";
import { initializeDatabase } from "./config/database";
import { initializeRedis } from "./config/redis";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Initialize Redis
    await initializeRedis();

    // Start the application
    const app = new App();
    app.start();

    // Handle shutdown gracefully
    process.on("SIGINT", () => {
      console.log("Server shutting down...");
      app.stop();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("Server terminating...");
      app.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
