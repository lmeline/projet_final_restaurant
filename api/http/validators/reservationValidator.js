const parseFields = require("./utils/requestParser");

/** Validate the body for creating a reservation. Returns the cleaned fields. */
function validateCreateReservationRequest(body) {
    const parsed = parseFields(body, ["number_of_people", "date", "time", "comment"]);
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

    return parsed;
}

/** Validate the body for updating a reservation. All fields are optional. */
function validateUpdateReservationRequest(body) {
    const parsed = parseFields(body, ["number_of_people", "date", "time", "comment"]);
    if (parsed.error) {
        return parsed;
    }

    if (parsed.number_of_people !== undefined) {
        if (typeof parsed.number_of_people !== "number" || parsed.number_of_people <= 0) {
            return { error: "Field `number_of_people` must be a number greater than 0" };
        }
    }
    if (parsed.date !== undefined && !validateDate(parsed.date)) {
        return { error: "Field `date` must be in format YYYY-MM-DD" };
    }
    if (parsed.time !== undefined && !validateTime(parsed.time)) {
        return { error: "Field `time` must be in format HH:MM" };
    }

    return parsed;
}

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

module.exports = { validateCreateReservationRequest, validateUpdateReservationRequest };
