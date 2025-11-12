import express, {Request, Response, NextFunction} from 'express';
import { pool } from './config/db';
import cors from 'cors';
import { initDatabase } from './core/dbInitializer';
import { errorHandler } from './middleware/errorMiddleware';
import http from 'http';
import inistalizeSocket from './socket';
import appConfig from './config/app.config';

const app = express();

app.use(cors({origin:"*"}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const server = http.createServer(app);
inistalizeSocket(server)
// Core Logic

export const printLog: boolean = process.env.printLog
  ? process.env.printLog.toLowerCase() === 'true': true; // default to true if not set
console.log(printLog)

// /* ------------------------------ 404 Handler ------------------------------ */
// app.use((req, res, next) => {
//   res.status(404).json({ success: false, error: 'Route Not Found' });
// });

// /* ------------------------ Global Error Middleware ------------------------ */
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    // Test DB connection before starting
    // await pool.query('SELECT NOW()');

    console.log('✅ Database connected successfully');

    server.listen(appConfig.PORT, async() => {
      // await initDatabase();
      // await testSession();
      console.log(`🚀 Server running on port ${appConfig.PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n⚡ Closing database pool...');
      await pool.end();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n⚡ Closing database pool...');
      await pool.end();
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database', err);
    process.exit(1); // stop server if DB fails
  }
};

startServer();