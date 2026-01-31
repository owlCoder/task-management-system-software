import { Db } from "./DbConnectionPool";

let initializationAttempts = 0;
let timeout = 5000;

export async function initialize_database() {
  try {
    initializationAttempts++;
    await Db.initialize();
    console.log("Database connected");

  } catch (err) {
    console.log(`Error during DataSource initialization ${err}`);
    if (initializationAttempts >= 5 && timeout < 30000) {
      timeout = 30000;
    }
    
    if (initializationAttempts < 15) {
      setTimeout(() => {
      console.log("Retrying database connection...");
      initialize_database();
      }, timeout);
    } 
  }
}