import express, { Request, Response, NextFunction } from 'express';
import { pool } from './config/db';
import cors from 'cors';
import { initDatabase } from './core/dbInitializer';
import { errorHandler } from './middleware/errorMiddleware';
import http from 'http';
import inistalizeSocket from './socket';
import appConfig from './config/app.config';
import allModules from './modules/all.modules';


const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//All Modules
app.use(allModules);
const server = http.createServer(app);
inistalizeSocket(server)


// /* ------------------------------ 404 Handler ------------------------------ */
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'Route Not Found' });
});

// /* ------------------------ Global Error Middleware ------------------------ */
app.use(errorHandler)

// Start server
const startServer = async () => {
    try {
        // Test DB connection before starting
        await pool.query('SELECT NOW()');

        appConfig.logger.log('✅ Database connected successfully');

        server.listen(appConfig.PORT, async () => {
            await initDatabase();
            // await testSession();
            appConfig.logger.log(`🚀 Server running on port ${appConfig.PORT}`);
        });

        // Graceful shutdown.log
        process.on('SIGINT', async () => {
             appConfig.logger.log('\n⚡ Closing database pool...');
            await pool.end();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
             appConfig.logger.log('\n⚡ Closing database pool...');
            await pool.end();
            process.exit(0);
        });
    } catch (err) {
        appConfig.logger.error('❌ Failed to connect to database', err);
        process.exit(1); // stop server if DB fails
    }
};

startServer();