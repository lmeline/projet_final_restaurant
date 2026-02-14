require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
const shouldSeed = process.env.SHOULD_SEED === "true";



const sql_files = fs.readdirSync(path.join(__dirname, "sources"))
    .filter((file) => file.endsWith(".sql"))
    .sort();

(async () => {
    const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            multipleStatements: true,
    });

    for (const file of sql_files) {
        if (file === "2_restaurant_db_seed.sql" && !shouldSeed) {
            break;
        }
        const sqlRequest = fs.readFileSync(path.join(__dirname, "sources", file))
            .toString();

        try {
            await tempConnection.query(sqlRequest);
            console.log("file " + file + " injected !");
        } catch (_) {
            console.log("an error occured while injecting file " + file);
            console.log("SQL_ERROR");
        }
        
    }
    await tempConnection.end();
})();




