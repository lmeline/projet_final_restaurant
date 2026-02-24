const parseFields = require("./utils/requestParser"); //

function validateStatRequest(query) {
    if (query.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(query.start_date)) {
        return { error: "Invalid start_date format" };
    }
    return query;
}

module.exports = { validateStatRequest };