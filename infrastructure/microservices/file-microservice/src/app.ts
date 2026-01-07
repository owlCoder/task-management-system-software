import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { FileController } from './WebAPI/FileController';
import { FileService } from './Services/FileService';
import { FileStorageService } from './Services/FileStorageService';
import { RoleValidationService } from './Services/RoleValidationService';
import { FileTypeValidationService } from './Services/FileTypeValidationService';
import { FileMapper } from './Utils/converters/FileMapper';
import { initializeDatabase } from './Database/InitializeConnection';
import { Db } from './Database/DbConnectionPool';
import { UploadedFile } from './Domain/models/UploadedFile';
import { Repository } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const app = express();

// CORS Management
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET", "POST", "PUT", "DELETE"];
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await initializeDatabase();

  // ORM Repository
  const fileRepository: Repository<UploadedFile> = Db.getRepository(UploadedFile);

  // Services
  const fileStorageService = new FileStorageService();
  const roleValidationService = new RoleValidationService();
  const fileTypeValidationService = new FileTypeValidationService();
  const fileMapper = new FileMapper();
  const fileService = new FileService(fileRepository, fileStorageService, fileMapper);

  // WebAPI routes
  const fileController = new FileController(fileService, roleValidationService, fileTypeValidationService, fileMapper);

  // Registering routes
  app.use('/api/v1', fileController.getRouter());
})();

export default app;