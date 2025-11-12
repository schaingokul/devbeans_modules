import pg from "pg";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, ".env") });

const { Pool } = pg;

// Singleton DB Class

class Database {
  private static instance: Database;
  private pool: pg.Pool;

  private constructor() {
    // Choose connection method dynamically
      this.pool = new Pool({
        user: String(process.env.DB_USER),
        host: String(process.env.DB_HOST),
        database: String(process.env.DB_NAME),
        password: String(process.env.DB_PASSWORD),
        port: Number(process.env.DB_PORT),
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
