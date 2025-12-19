import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`File microservice running on port ${port}`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});