/**
 * DiningTable entity.
 */
class DiningTable {
    constructor({ id, label = null, seats, isActive = true }) {
        this.id = id;
        this.label = label;
        this.seats = seats;
        this.isActive = isActive;
    }

    static fromRow(row) {
        return new DiningTable({
            id: row.id,
            label: row.label ?? null,
            seats: row.seats,
            isActive: row.is_active === undefined ? true : Boolean(row.is_active),
        });
    }

    toJSON() {
        return {
            id: this.id,
            label: this.label,
            seats: this.seats,
            is_active: this.isActive,
        };
    }
}

module.exports = DiningTable;
