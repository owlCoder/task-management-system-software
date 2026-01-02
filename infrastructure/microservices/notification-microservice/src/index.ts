import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import { createServer } from "http";
import { DataSource } from "typeorm";
import { createApp } from "./app";
import { Notification } from "./Domain/models/Notification";
import { NotificationService } from "./Service/NotificationService";
import { NotificationMapper } from "./Utils/converters/NotificationMapper";
import { SocketService } from "./WebSocket/SocketService";

// ENVIRONMENT VARIABLES
const PORT = process.env.PORT || 6432;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "3306");
const DB_USERNAME = process.env.DB_USERNAME || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_DATABASE = process.env.DB_DATABASE || "notification_service";

// TYPEORM DATA SOURCE
const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [Notification],
  migrations: [],
  subscribers: [],
});

// SERVER INITIALIZATION
const startServer = async () => {
  try {
    console.clear();
    
    // 1. Inicijalizuj TypeORM konekciju
    console.log("Connecting to database...");
    await AppDataSource.initialize();
    console.log("Database connected successfully!");

    // 2. Kreiraj TypeORM Repository
    const notificationRepository = AppDataSource.getRepository(Notification);

    // 3. Kreiraj NotificationMapper
    const notificationMapper = new NotificationMapper();

    // 4. Kreiraj NotificationService (injektuj TypeORM repository direktno)
    const notificationService = new NotificationService(
      notificationRepository,
      notificationMapper
    );

    // 6. Kreiraj Express aplikaciju (injektuj NotificationService)
    const app = createApp(notificationService);

    // 7. Kreiraj HTTP server (za Socket.IO)
    const httpServer = createServer(app);

    // 8. Inicijalizuj Socket.IO
    const socketService = new SocketService(httpServer);

    // 9. Injektuj SocketService u NotificationService
    notificationService.setSocketService(socketService);

    // 10. Pokreni server
    httpServer.listen(PORT, () => {
      console.log("\x1b[32m╔════════════════════════════════════════╗\x1b[0m");
      console.log("\x1b[32m║    Notification Service Started    ║\x1b[0m");
      console.log("\x1b[32m╚════════════════════════════════════════╝\x1b[0m");
      console.log(`\x1b[36m📡 Server:\x1b[0m       http://localhost:${PORT}`);
      console.log(`\x1b[36m🏥 Health Check:\x1b[0m http://localhost:${PORT}/health`);
      console.log(`\x1b[36m📬 API Endpoint:\x1b[0m http://localhost:${PORT}/api/notifications`);
      console.log(`\x1b[36m🔌 WebSocket:\x1b[0m    ws://localhost:${PORT}`);
      console.log(`\x1b[33m⚙️  Environment:\x1b[0m  ${process.env.NODE_ENV || "development"}`);
      console.log("\x1b[32m════════════════════════════════════════\x1b[0m\n");
    });

  } catch (error) {
    console.error("\x1b[31m Error starting server:\x1b[0m", error);
    process.exit(1);
  }
};

// GRACEFUL SHUTDOWN
process.on("SIGINT", async () => {
  console.log("\n\x1b[33m Shutting down gracefully...\x1b[0m");
  
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("\x1b[32m Database connection closed\x1b[0m");
  }
  
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\x1b[33m Shutting down gracefully...\x1b[0m");
  
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("\x1b[32m Database connection closed\x1b[0m");
  }
  
  process.exit(0);
});

// START SERVER
startServer();