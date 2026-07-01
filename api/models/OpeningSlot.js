/**
 * OpeningSlot entity. Represents a service window during which the restaurant
 * is open (lunch / dinner) for a given day.
 */
class OpeningSlot {
    constructor({ id, dateTime, duration, service, available = true, comment = null }) {
        this.id = id;
        this.dateTime = dateTime;
        this.duration = duration;
        this.service = service;
        this.available = available;
        this.comment = comment;
    }

    static fromRow(row) {
        return new OpeningSlot({
            id: row.id,
            dateTime: row.date_time,
            duration: row.duration,
            service: row.service,
            available: row.available === undefined ? true : Boolean(row.available),
            comment: row.comment ?? null,
        });
    }

    toJSON() {
        return {
            id: this.id,
            date_time: this.dateTime,
            duration: this.duration,
            service: this.service,
            available: this.available,
            comment: this.comment,
        };
    }
}

module.exports = OpeningSlot;
