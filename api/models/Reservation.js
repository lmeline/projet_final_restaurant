/**
 * Reservation entity (domain object). SQL lives in ReservationRepository.
 */
class Reservation {
    constructor({
        id,
        slotId,
        userId,
        numberOfPeople,
        startsAt,
        endsAt,
        status,
        comment = null,
        cancelledAt = null,
        tables = [],
    }) {
        this.id = id;
        this.slotId = slotId;
        this.userId = userId;
        this.numberOfPeople = numberOfPeople;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.status = status;
        this.comment = comment;
        this.cancelledAt = cancelledAt;
        this.tables = tables;
    }

    static fromRow(row) {
        return new Reservation({
            id: row.id,
            slotId: row.slot_id,
            userId: row.user_id,
            numberOfPeople: row.number_of_people,
            startsAt: row.starts_at,
            endsAt: row.ends_at,
            status: row.status,
            comment: row.comment ?? null,
            cancelledAt: row.cancelled_at ?? null,
            tables: row.tables_id ? String(row.tables_id).split(",").map(Number) : [],
        });
    }

    isModifiable() {
        return this.status === "pending";
    }

    belongsTo(userId) {
        return Number(this.userId) === Number(userId);
    }

    toJSON() {
        return {
            id: this.id,
            slot_id: this.slotId,
            user_id: this.userId,
            number_of_people: this.numberOfPeople,
            starts_at: this.startsAt,
            ends_at: this.endsAt,
            status: this.status,
            comment: this.comment,
            cancelled_at: this.cancelledAt,
            tables: this.tables,
        };
    }
}

module.exports = Reservation;
