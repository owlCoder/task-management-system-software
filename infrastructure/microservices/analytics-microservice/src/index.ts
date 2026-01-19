console.clear();
import { initApp } from "./app";

const port = process.env.PORT || 5000;

(async () => {
  const app = await initApp();

  app.listen(port, () => {
    console.log(
      `\x1b[36m[Analytics Microservice]\x1b[0m listening on http://localhost:${port}`
    );
  });
})();
