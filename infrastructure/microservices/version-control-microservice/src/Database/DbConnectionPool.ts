import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Review} from "../Domain/models/Review";
import { ReviewComment } from "../Domain/models/ReviewComment";
import { TaskTemplate } from "../Domain/models/TaskTemplate";
import { TemplateDependency } from "../Domain/models/TemplateDependency";

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
  entities: [Review, ReviewComment, TaskTemplate, TemplateDependency],
});
