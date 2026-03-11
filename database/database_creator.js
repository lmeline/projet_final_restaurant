require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

if (!process.env.DB_HOST) {
    console.error("Missing DB_HOST environment variable");
    process.exit(1);
}
if (!process.env.DB_USERNAME) {
    console.error("Missing DB_USERNAME environment variable");
    process.exit(1);
}
if (!process.env.DB_PORT) {
    console.error("Missing DB_PORT environment variable");
    process.exit(1);
}
if (!process.env.DB_NAME) {
    console.error("Missing DB_NAME environment variable");
    process.exit(1);
}



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
        let sqlRequest = fs.readFileSync(path.join(__dirname, "sources", file))
            .toString();
        
        sqlRequest = sqlRequest.replaceAll("db_name_placeholder", process.env.DB_NAME);

        try {
            await tempConnection.query(sqlRequest);
            console.log("file " + file + " injected !");
        } catch (err) {
            console.log("an error occured while injecting file " + file);
            console.error("SQL_ERROR : ", err);
        }
        
    }

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        const PasswordHasher = require("../api/utils/passwordHasher");

        const hashedPassword = await PasswordHasher.hashPassword(process.env.ADMIN_PASSWORD);

        await tempConnection.query("INSERT INTO users (email, password_hash, firstname, lastname, role) VALUES (?, ?, 'Admin', 'Resto', 'admin')", [process.env.ADMIN_EMAIL, hashedPassword]);

        console.log(`Admin ${process.env.ADMIN_EMAIL} created !`);
    }

    if (process.env.CLIENT_EMAIL && process.env.CLIENT_PASSWORD) {
        const PasswordHasher = require("../api/utils/passwordHasher");
        const hashedPassword = await PasswordHasher.hashPassword(process.env.CLIENT_PASSWORD);

        const [insertedUserId] = await tempConnection.query("INSERT INTO users (email, password_hash, firstname, lastname, role) VALUES (?, ?, 'Client', 'Test', 'client')", [process.env.CLIENT_EMAIL, hashedPassword]);

        const [insertedReservationId] = await tempConnection.query("INSERT INTO reservations (number_of_people, `date`, `time`, `status`, user_id, comment) VALUES (10, '2026-03-13', '12:07:00', 'pending', ?, 'Test reservation')", [insertedUserId.insertId])
        await tempConnection.query("INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?,1), (?,6);", [insertedReservationId.insertId, insertedReservationId.insertId]);

        console.log(`Client ${process.env.CLIENT_EMAIL} created !`);
    }

    await tempConnection.end();
})();




