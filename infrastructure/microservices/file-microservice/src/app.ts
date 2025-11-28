import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { FileController } from './WebAPI/FileController';
import { FileService } from './Services/FileService';
import { FileStorageService } from './Services/FileStorageService';
import { FileRepository } from './Database/FileRepository';
import Database from './Database/Database';

class App {
  public express: express.Application;
  private fileController!: FileController;

  constructor() {
    this.express = express();
    this.initializeDatabase();
    this.initializeServices();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const database = Database.getInstance();
      await database.connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  private initializeServices(): void {
    const fileRepository = new FileRepository();
    const fileStorageService = new FileStorageService();
    const fileService = new FileService(fileRepository, fileStorageService);
    this.fileController = new FileController(fileService);
  }

  private initializeMiddlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    const upload = multer({ 
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    });

    this.express.post('/api/files/upload', upload.single('file'), this.fileController.uploadFile);
    this.express.get('/api/files/download/:fileId', this.fileController.downloadFile);
    this.express.delete('/api/files/:fileId', this.fileController.deleteFile);
    this.express.get('/api/files/author/:authorId', this.fileController.getFilesByAuthor);
    this.express.get('/api/files/metadata/:fileId', this.fileController.getFileMetadata);

    this.express.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', service: 'file-microservice' });
    });
  }
}

export default App;