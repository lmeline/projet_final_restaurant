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

module.exports = validateCreateTableRequest;