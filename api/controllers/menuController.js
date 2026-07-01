const menuRepository = require("../repositories/menuRepository");
const queryValidator = require("../http/validators/utils/queryValidator");

async function list(req, res) {
    const params = queryValidator(req.query, {
        category: ["entree", "plat", "dessert"],
        "max-price": "number",
    });
    if (params.error) {
        return res.status(400).json(params);
    }

    try {
        const items = await menuRepository.list(params);

        const grouped = {};
        for (const item of items) {
            (grouped[item.category] ??= []).push(item);
        }

        res.json(grouped);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { list };
