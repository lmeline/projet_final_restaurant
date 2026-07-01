const parseFields = require("./utils/requestParser");

/** Validate the body for creating a table. Returns the cleaned fields. */
function validateCreateTableRequest(body) {
    const parsed = parseFields(body, ["capacity", "label"]);
    if (parsed.error) {
        return parsed;
    }

    if (Number.isNaN(Number(parsed.capacity)) || Number(parsed.capacity) <= 0) {
        return { error: "Field `capacity` is required and must be an integer greater than 0" };
    }

    return parsed;
}

module.exports = { validateCreateTableRequest };
