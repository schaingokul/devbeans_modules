import fs from "fs";
import path from "path";
import TableFactory from "../core/factory/dynamicModelFactory";
import appConfig from "../config/app.config";


// const modules = ["users"];
// Get all module folder names that have a "model" directory
const modulesPath = path.resolve(__dirname, "../modules");
const modules = fs.readdirSync(path.resolve(__dirname, "../modules"))
                  .filter((dir) => fs.existsSync(path.resolve(__dirname, "../modules", dir, "model", `${dir}Model.sql`)));

export const initDatabase = async () => {
    const successLogs = [];
    const failureLogs = [];

  try {
    
    for (const moduleName of modules) {
      const modelDir = path.join(modulesPath, moduleName, "model");
      const sqlFiles = fs.readdirSync(modelDir).filter((f) => f.endsWith(".sql"));

      if (sqlFiles.length === 0) {
        console.warn(`⚠️ No .sql files found for module: ${moduleName}`);
        continue;
      }

      for (const file of sqlFiles) {
        const sqlFilePath = path.join(modelDir, file);
        const sql = fs.readFileSync(sqlFilePath, "utf-8");
        // Use filename (without extension) as table name reference
        const tableName = file.replace(".sql", "");
        try {
          await TableFactory.newTable(tableName, sql);
          successLogs.push(`✅ ${moduleName} → ${tableName}`);
        } catch (err:any) {
          failureLogs.push(`❌ ${moduleName} → ${tableName}: ${err.message}`);
        }
      }
    }

    appConfig.logger.log("\n🧩 DATABASE INITIALIZATION SUMMARY ------------------");
    appConfig.logger.log("✅ Success:");
    successLogs.forEach((msg) => appConfig.logger.log("   ", msg));

    if (failureLogs.length > 0) {
      appConfig.logger.log("\n❌ Failed:");
      failureLogs.forEach((msg) => appConfig.logger.log("   ", msg));
    } else {
      appConfig.logger.log("\n✨ All tables initialized successfully with no errors!");
    }

    appConfig.logger.log("---------------------------------------------------\n");
  } catch (err) {
    appConfig.logger.error("❌ Database initialization failed:", err);
    process.exit(1); // stop server if db init fails
  }
};