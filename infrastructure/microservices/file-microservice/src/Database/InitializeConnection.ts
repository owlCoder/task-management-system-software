import { Db } from "./DbConnectionPool";

let initialization_attempts = 0;
let timeout = 5000;

export async function initializeDatabase() {
  try {
    initialization_attempts++;
    await Db.initialize();
    console.log("Database connected");

  } catch (err) {
    console.error(`Error during DataSource initialization ${err}`);
    if (initialization_attempts >= 5 && timeout < 30000) {
      timeout = 30000;
    }
    
    if (initialization_attempts < 15) {
      setTimeout(() => {
      console.warn("Retrying database connection...");
      initializeDatabase();
      }, timeout);
    } 
  }
}
