console.clear();
import app from './app';

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `\x1b[36m[Analytics Microservice]\x1b[0m listening on http://localhost:${port}`
  );
});

