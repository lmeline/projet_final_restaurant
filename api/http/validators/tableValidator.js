const db = require("../../repositories/config/db");

const parseFields = require("./utils/requestParser");

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

/**
 * Check if the required tables are available for a given date and time.
 * @param {Object} requiredMap - A map of required table sizes and their counts
 * @param {string} date - Format "YYYY-MM-DD"
 * @param {string} time - Format "HH:MM"
 * @returns {Object} - { available: boolean, tableIds: Array, error: string }
 */
async function checkTablesAvailability(requiredMap, date, time) {
    try {
        let selectedTableIds = [];
        let alreadyPickedIds = [];

        const requirements = Object.entries(requiredMap);

        for (const [size, count] of requirements) {
            for (let i = 0; i < count; i++) {
                
                const query = `
                    SELECT t.id 
                    FROM tables t
                    WHERE t.seats = ? 
                    AND t.id NOT IN (
                        SELECT rt.table_id 
                        FROM reservation_tables rt
                        JOIN reservations r ON rt.reservation_id = r.id
                        WHERE r.date = ? AND r.time = ?
                    )
                    ${alreadyPickedIds.length > 0 ? `AND t.id NOT IN (${alreadyPickedIds.join(',')})` : ''}
                    LIMIT 1
                `;

                const [rows] = await db.query(query, [size, date, time]);

                if (rows.length === 0) {
                    return { 
                        available: false, 
                        error: `Plus de table de ${size} places disponible pour ce créneau (besoin de ${count}).` 
                    };
                }

                selectedTableIds.push(rows[0].id);
                alreadyPickedIds.push(rows[0].id);
            }
        }

        return { available: true, tableIds: selectedTableIds };

    } catch (error) {
        console.error("Erreur tableValidator:", error);
        return { available: false, error: "Erreur lors de la vérification des tables." };
    }
}

module.exports = { checkTablesAvailability, validateCreateTableRequest };