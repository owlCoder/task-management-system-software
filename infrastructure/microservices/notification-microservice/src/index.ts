import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import { createServer } from "http";
import { createApp } from "./app";
import { Notification } from "./Domain/models/Notification";
import { NotificationService } from "./Service/NotificationService";
import { NotificationMapper } from "./Utils/converters/NotificationMapper";
import { SocketService } from "./WebSocket/SocketService";
import { Db } from "./Database/DbConnectionPool";
import { initializeDatabase, closeDatabase } from "./Database/InitializeConnection";

const PORT = process.env.PORT || 5003;

const startServer = async () => {
  try {
    console.clear();

    // 1. Inicijalizuj bazu podataka
    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      process.exit(1);
    }

    // 2. Kreiraj Repository
    const notificationRepository = Db.getRepository(Notification);

    // 3. Kreiraj Mapper
    const notificationMapper = new NotificationMapper();

    // 4. Kreiraj Service
    const notificationService = new NotificationService(
      notificationRepository,
      notificationMapper
    );

    // 5. Kreiraj Express aplikaciju
    const app = createApp(notificationService);

    // 6. Kreiraj HTTP server
    const httpServer = createServer(app);

    // 7. Inicijalizuj WebSocket
    const socketService = new SocketService(httpServer);

    // 8. Injektuj SocketService u NotificationService
    notificationService.setSocketService(socketService);

    // 9. Pokreni server
    httpServer.listen(PORT, () => {
      console.log("\x1b[32m╔════════════════════════════════════════╗\x1b[0m");
      console.log("\x1b[32m║    Notification Service Started        ║\x1b[0m");
      console.log("\x1b[32m╚════════════════════════════════════════╝\x1b[0m");
      console.log(`\x1b[36m Server:\x1b[0m       http://localhost:${PORT}`);
      console.log(`\x1b[36m Health Check:\x1b[0m http://localhost:${PORT}/health`);
      console.log(`\x1b[36m API Endpoint:\x1b[0m http://localhost:${PORT}/api/notifications`);
      console.log(`\x1b[36m WebSocket:\x1b[0m    ws://localhost:${PORT}`);
      console.log(`\x1b[33m Environment:\x1b[0m  ${process.env.NODE_ENV || "development"}`);
      console.log("\x1b[32m════════════════════════════════════════\x1b[0m\n");
    });

  } catch (error) {
    console.error("\x1b[31m Error starting server:\x1b[0m", error);
    process.exit(1);
  }
};

// GRACEFUL SHUTDOWN
const gracefulShutdown = async () => {
  console.log("\n\x1b[33m Shutting down gracefully...\x1b[0m");
  await closeDatabase();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// START SERVER
startServer();
