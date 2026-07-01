const tableRepository = require("../repositories/tableRepository");
const { validateCreateTableRequest } = require("../http/validators/tableValidator");

async function list(req, res) {
    try {
        const tables = await tableRepository.list();
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

async function create(req, res) {
    const validation = validateCreateTableRequest(req.body);
    if (validation.error) {
        return res.status(400).json(validation);
    }

    try {
        const id = await tableRepository.create({
            seats: Number(validation.capacity),
            label: validation.label ?? null,
        });
        const table = await tableRepository.findById(id);

        res.status(201).json({ message: "Table created successfully", table });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getById(req, res) {
    try {
        const table = await tableRepository.findById(req.params.id);
        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }
        res.json(table);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { list, create, getById };
