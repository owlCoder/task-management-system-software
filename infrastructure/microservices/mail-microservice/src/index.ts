import dotenv from "dotenv"
dotenv.config();
import app from './app';


const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`\x1b[32m[TCPListen@2.1]\x1b[0m localhost:${port}`);
  setInterval(() => {}, 30_000);
});
