import { Db } from "./DbConnectionPool";

let initializationAttempts = 0;
const MAX_ATTEMPTS = 5;
const RETRY_DELAY = 5000;

export async function initializeDatabase(): Promise<boolean> {
  try {
    initializationAttempts++;
    console.log("Connecting to database...");
    await Db.initialize();
    console.log("Database connected successfully!");
    return true;
  } catch (err) {
    console.error(`Error during DataSource initialization: ${err}`);

    if (initializationAttempts < MAX_ATTEMPTS) {
      console.log(`Retrying database connection in ${RETRY_DELAY / 1000}s... (attempt ${initializationAttempts}/${MAX_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return initializeDatabase();
    }

    console.error("Max database connection attempts reached. Exiting...");
    return false;
  }
}

export async function closeDatabase(): Promise<void> {
  if (Db.isInitialized) {
    await Db.destroy();
    console.log("Database connection closed");
  }
}
