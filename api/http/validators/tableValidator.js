const db = require("../../repositories/config/db");

const parseFields = require("./utils/requestParser");

// Function to check the validity of the request body for creating a table
function validateCreateTableRequest(body) {

    let parsed = parseFields(body, ["capacity"]);

    if (parsed.error) {
        return parsed;
    }

    if (Number.isNaN(Number(body.capacity)) || body.capacity <= 0) {
        return { error: "Field `capacity` must be a integer greater than 0" };
    }

    return parsed;

}
 
// Function to check if the required tables are available for a given date and time
async function checkTablesAvailability(connection, requiredMap, date, time) {
    let selectedTableIds = [];
    const durationHours = "02:00:00"; 

    for (const [size, count] of Object.entries(requiredMap)) {
        for (let i = 0; i < count; i++) {
            const [rows] = await connection.query(`
                SELECT t.id FROM tables t
                WHERE t.seats = ? 
                AND t.id NOT IN (
                    SELECT rt.table_id FROM reservation_tables rt
                    JOIN reservations r ON rt.reservation_id = r.id
                    WHERE r.date = ? 
                    AND r.status != 'cancelled'
                    AND r.time < ADDTIME(?, ?)  -- Fin demandée
                    AND ADDTIME(r.time, ?) > ?   -- Début demandé
                )
                ${selectedTableIds.length > 0 ? `AND t.id NOT IN (${selectedTableIds.join(',')})` : ''}
                LIMIT 1
            `, [size, date, time, durationHours, durationHours, time]);

            if (rows.length === 0) {
                return { available: false, error: `Plus de table de ${size} places disponible.` };
            }
            selectedTableIds.push(rows[0].id);
        }
    }
    return { available: true, tableIds: selectedTableIds };
}

module.exports = { checkTablesAvailability, validateCreateTableRequest };