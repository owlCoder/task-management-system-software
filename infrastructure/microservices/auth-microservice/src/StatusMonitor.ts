// import { DataSource } from "typeorm";
// import { EmailService } from "./Services/EmailService";

// export class StatusMonitor {
//   private previousStates: { db: boolean; email: boolean } | null = null;
//   private intervalId: NodeJS.Timeout | null = null;

//   constructor(private db: DataSource, private emailService: EmailService) {}

//   start(intervalMs: number = 5000) {
//     this.intervalId = setInterval(() => this.checkAndDisplayStatus(), intervalMs);
//     // Initial display
//     this.checkAndDisplayStatus();
//   }

//   stop() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//     }
//   }

//   private checkAndDisplayStatus() {
//     const dbConnected = this.db.isInitialized;
//     const emailConnected = this.emailService.isAvailable;

//     const currentStates = { db: dbConnected, email: emailConnected };

//     if (this.previousStates === null || 
//         this.previousStates.db !== currentStates.db || 
//         this.previousStates.email !== currentStates.email) {
      
//       const systemState = `Running (uptime: ${Math.floor(process.uptime())}s)`;
//       const dbStatus = dbConnected ? "Connected" : "Disconnected";
//       const emailStatus = emailConnected ? "Connected" : "Disconnected";
//       const overallStatus = (dbConnected && emailConnected) ? "Available" : "Unavailable";

//       const statusLines = [
//         `System State: ${this.colorize(systemState, true)}`,
//         `Database Connection: ${this.colorize(dbStatus, dbConnected)}`,
//         `Mailing Service Connection: ${this.colorize(emailStatus, emailConnected)}`,
//         `Overall System Availability: ${this.colorize(overallStatus, dbConnected && emailConnected)}`
//       ];

//       // Clear screen and move to top
//       process.stdout.write('\x1b[2J\x1b[H');
//       console.log('=== System Status Monitor ===');
//       console.log(statusLines.join('\n'));

//       this.previousStates = currentStates;
//     }
//   }

//   private colorize(text: string, isGood: boolean): string {
//     const color = isGood ? '\x1b[32m' : '\x1b[31m'; // Green for good, red for bad
//     return `${color}${text}\x1b[0m`;
//   }
// }