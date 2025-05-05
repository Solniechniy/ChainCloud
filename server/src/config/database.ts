import { DataSource } from "typeorm";
import { Device } from "../entities/Device";
import { DataBlock } from "../entities/DataBlock";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "chaincloud",
  password: process.env.DB_PASSWORD || "chaincloud_password",
  database: process.env.DB_NAME || "chaincloud",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [Device, DataBlock],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Error initializing database connection:", error);
    throw error;
  }
};
