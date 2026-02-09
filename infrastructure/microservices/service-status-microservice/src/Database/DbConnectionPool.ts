import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Measurement } from "../Domain/models/Measurement";
import { Microservice } from "../Domain/models/Microservice";

dotenv.config();

export const Db = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  synchronize: false, 
  logging: false, 
  entities: [Microservice, Measurement] 
});
