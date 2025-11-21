import { Db } from "./DbConnectionPool";

let initialization_attempts = 0;
let timeout = 5000;

export async function initialize_database() {
  try {
    await Db.initialize();
    initialization_attempts++;
    console.log("\x1b[34m[DbConn@1.12.4]\x1b[0m Database connected");

  } catch (err) {
    console.error("\x1b[31m[DbConn@1.12.4]\x1b[0m Error during DataSource initialization ", err);
    if (initialization_attempts >= 5 && timeout < 30000) {
      timeout = 30000;
    }
    
    if (initialization_attempts < 15) {
      setTimeout(() => {
      console.log("\x1b[33m[DbConn@1.12.4]\x1b[0m Retrying database connection...");
      initialize_database();
      }, timeout);
    } 
  }
}