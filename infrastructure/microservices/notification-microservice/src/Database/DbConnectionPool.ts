import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Notification } from "../Domain/models/Notification";

dotenv.config();

export const Db = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "notification_service",
  synchronize: false, // automatsko kreiranje tabela u bazi
  logging: process.env.NODE_ENV === "development",
  entities: [Notification],
  migrations: [],
  subscribers: [],
});
