console.clear();
import { initApp } from "./app";

const port = process.env.PORT || 5000;

(async () => {
  const app = await initApp();

  app.listen(port, () => {
    console.log(`\x1b[95m[Analytics Microservice]\x1b[0m`);
    console.log(`Project Database \x1b[32mConnected\x1b[0m`);
    console.log(`Task Database \x1b[32mConnected\x1b[0m`);
    console.log(`\x1b[36mMicroservice\x1b[0m listening on http://localhost:${port}`);
  });

})();
