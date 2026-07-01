const openingSlotRepository = require("../repositories/openingSlotRepository");
const tableRepository = require("../repositories/tableRepository");
const assignTables = require("../utils/tableAssigner");
const DomainError = require("../utils/DomainError");

const RESERVATION_DURATION_MINUTES = 120;

function toDateTimeString(date, time) {
    const normalizedTime = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
    return `${date} ${normalizedTime}`;
}

function addMinutes(dateTimeStr, minutes) {
    const d = new Date(dateTimeStr.replace(" ", "T"));
    d.setMinutes(d.getMinutes() + minutes);
    const pad = (n) => String(n).padStart(2, "0");
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
}

/**
 * Resolve everything needed to (re)book a reservation for a given date/time and
 * party size: the covering opening slot, the time window, and the tables to use.
 *
 * @throws {DomainError} 400 if the restaurant is closed, 409 if no table fits.
 * @returns {{ slotId, startsAt, endsAt, tables }}
 */
async function planAssignment({ date, time, numberOfPeople, excludeReservationId = null }) {
    const startsAt = toDateTimeString(date, time);
    const endsAt = addMinutes(startsAt, RESERVATION_DURATION_MINUTES);

    const slot = await openingSlotRepository.findCovering(startsAt);
    if (!slot) {
        throw new DomainError(400, "Restaurant is closed at this time.");
    }

    const availableTables = await tableRepository.findAvailable(startsAt, endsAt, excludeReservationId);
    const tables = assignTables(availableTables, numberOfPeople);
    if (!tables) {
        throw new DomainError(409, "No available tables for this number of people.");
    }

    return { slotId: slot.id, startsAt, endsAt, tables };
}

module.exports = { planAssignment, RESERVATION_DURATION_MINUTES };
