import { pool } from "../../config/db";
import appConfig from "../../config/app.config";

const tableCache: { [key: string]: boolean | string | number | null | undefined } = {};

/**
 * Create a table dynamically if not exists
 * @param tableName - name of the table
 * @param columns - SQL string defining columns, e.g., "id SERIAL PRIMARY KEY, name VARCHAR(255)"
 */

class TableFactory {
  static async newTable(tableName: string, sql: any): Promise<void | string> {
    if (tableCache[tableName]) {
      appConfig.logger.log(`⚡ Reusing existing table: ${tableName}`);
      return tableName;
    }

    const statements = sql
      .split(";")
      .map((stmt:any) => stmt.trim())
      .filter(Boolean);

    for (const stmt of statements) {
      await pool.query(stmt);
    }

    tableCache[tableName] = true;
    appConfig.logger.log(`✅ Created tables for module: ${tableName}`);
  }
}

export default TableFactory;