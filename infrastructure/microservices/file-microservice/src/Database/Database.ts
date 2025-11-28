import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private static instance: Database;
  private connection?: mysql.Connection;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (!this.connection) {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: 'uploaded_files_db'
      });
    }
  }

  public async getConnection(): Promise<mysql.Connection> {
    if (!this.connection) {
      await this.connect();
    }
    return this.connection!;
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = undefined;
    }
  }
}

export default Database;