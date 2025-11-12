import dotenv from "dotenv";
import path from "path";

// ✅ Load .env file (adjust path if it's in a subfolder)
dotenv.config({
  path: path.resolve(__dirname, "../../db/.env"), // ← relative to project root
});

// Define interface types for strong structure
interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

class AppConfig {
  public readonly PORT: number;
  public readonly env: string;
  public readonly db: DBConfig;
  public readonly redis: RedisConfig;

  constructor() {
    // Server
    this.PORT = Number(this.get("PORT", 3000));
    this.env = this.get("NODE_ENV", "development");

    // PostgreSQL
    this.db = {
      host: this.get("DB_HOST"),
      port: Number(this.get("DB_PORT", 5432)),
      user: this.get("DB_USER"),
      password: this.get("DB_PASSWORD"),
      database: this.get("DB_NAME"),
    };

    // Redis
    this.redis = {
      host: this.get("REDIS_HOST"),
      port: Number(this.get("REDIS_PORT", 6379)),
      password: this.get("REDIS_PASSWORD", ""),
    };
  }

  /**
   * Safely fetch env variables
   */
  private get(key: string, defaultValue?: string | number): string {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
      throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value || String(defaultValue);
  }

}

export default new AppConfig();
