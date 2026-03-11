const db = require("../../repositories/config/db");

const parseFields = require("./utils/requestParser");

/** Function to check the validity of the request body for creating a table */
function validateCreateTableRequest(body) {

    let parsed = parseFields(body, ["capacity"]);

    if (parsed.error) {
        return parsed;
    }

    if (Number.isNaN(Number(body.capacity)) || body.capacity <= 0) {
        return { error: "Field `capacity` is required and must be a integer greater than 0" };
    }

    return parsed;

}


module.exports = { validateCreateTableRequest };