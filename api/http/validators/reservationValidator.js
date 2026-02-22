const parseFields = require("./utils/requestParser");

// Function to check the validity of the request body for creating a reservation
function validateCreateReservationRequest(body) {
    let parsed = parseFields(body, ["number_of_people", "date", "time", "note"]);

    if (parsed.error) {
        return parsed;
    }

    const { number_of_people, date, time } = parsed;

    if (typeof number_of_people !== "number" || number_of_people <= 0) {
        return { error: "Field `number_of_people` must be a number greater than 0" };
    }
    if (typeof date !== "string" || !validateDate(date)) {
        return { error: "Field `date` is required and must be in format YYYY-MM-DD" };
    }
    if (typeof time !== "string" || !validateTime(time)) {
        return { error: "Field `time` is required and must be in format HH:MM" };
    }

    if (!isFuture(date, time)) {
        return { error: "Date and time must be in the future" };
    }

    return body;
}

// Function to check the validity of the request body for updating a reservation
function validateUpdateReservationRequest(body) {
    const allowedFields = ["number_of_people", "date", "time", "note"];
    let parsed = parseFields(body, allowedFields);

    if (parsed.error) {
        return parsed;
    }

    if (body.number_of_people !== undefined) {
        if (typeof body.number_of_people !== "number" || body.number_of_people <= 0) {
            return { error: "Field `number_of_people` must be a number greater than 0" };
        }
    }

    if (body.date !== undefined) {
        if (!validateDate(body.date)) return { error: "Invalid date format" };
    }

    if (body.time !== undefined) {
        if (!validateTime(body.time)) return { error: "Invalid time format" };
    }

    return body;
}

function validateListReservationsRequest(query) {
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    const filters = {};

    // Validation du statut
    if (query.status) {
        if (!validStatuses.includes(query.status)) {
            return { error: "Invalid status. Must be pending, confirmed, or cancelled." };
        }
        filters.status = query.status;
    }

    // Validation de la date
    if (query.date) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(query.date)) {
            return { error: "Invalid date format. Use YYYY-MM-DD." };
        }
        filters.date = query.date;
    }

    return filters; // Retourne uniquement les filtres validés
}

// Utility functions
function validateDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function validateTime(time) {
    return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(time);
}

function isFuture(date, time) {
    const reservationDate = new Date(`${date}T${time}`);
    return reservationDate > new Date();
}


module.exports = {validateCreateReservationRequest, validateUpdateReservationRequest, validateListReservationsRequest};