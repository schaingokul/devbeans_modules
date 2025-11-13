import pg from "pg";
import dotenv from 'dotenv';
import path from 'path';
import appConfig from "../app.config";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const { Pool } = pg;

// Singleton DB Class

class Database {
  private static instance: Database;
  private pool: pg.Pool;

  private constructor() {
    // Choose connection method dynamically
      this.pool = new Pool({
        user: appConfig.db.user,
        host: appConfig.db.host,
        database: appConfig.db.database,
        password: appConfig.db.password,
        port: appConfig.db.port,
        max: appConfig.db.maxConnections || 10,
        idleTimeoutMillis: Number(appConfig.db.idleTimeoutMillis) || 30000,
        connectionTimeoutMillis: Number(appConfig.db.connectionTimeoutMillis) || 2000,
      });
      console.log("✅ Connecting... to local PostgreSQL");
  }

  public static getInstance():Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    // console.log("instance", Database.instance)
    return Database.instance;
  }

  public getPool():pg.Pool {
    // console.log("Pool",this.pool)
    return this.pool;
  }
}

// Export the pool directly
export const pool = Database.getInstance().getPool();
export default Database;
