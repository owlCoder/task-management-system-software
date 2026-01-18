import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Task } from "../Domain/models/Task";
import { Comment } from "../Domain/models/Comment";
import { TaskVersion } from "../Domain/models/TaskVersion";

dotenv.config();

export const Db = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  synchronize: false, // automatsko kreiranje tabela u bazi 
  logging: false, // debug sql gresaka
  entities: [Task, Comment, TaskVersion],
});
