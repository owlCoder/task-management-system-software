console.clear();
import dotenv from "dotenv";
import { initApp } from "./app";

dotenv.config({ quiet: true });

const port = process.env.PORT || 7000;

(async () => {
  const app = await initApp();

  app.listen(port, () => {
    console.log(`\x1b[95m[LocalLLM Microservice]\x1b[0m`);
    console.log(`\x1b[36mMicroservice\x1b[0m listening on http://localhost:${port}`);
  });
})();
