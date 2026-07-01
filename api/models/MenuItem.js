/**
 * MenuItem entity. Prices are stored and exposed in cents (1100 = 11.00 EUR).
 */
class MenuItem {
    constructor({ id, name, description = null, priceCents, category, isAvailable = true }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priceCents = priceCents;
        this.category = category;
        this.isAvailable = isAvailable;
    }

    static fromRow(row) {
        return new MenuItem({
            id: row.id,
            name: row.name,
            description: row.description ?? null,
            priceCents: row.price_cents,
            category: row.category,
            isAvailable: row.is_available === undefined ? true : Boolean(row.is_available),
        });
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price_cents: this.priceCents,
            category: this.category,
            is_available: this.isAvailable,
        };
    }
}

module.exports = MenuItem;
