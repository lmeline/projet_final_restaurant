const express = require("express");
const router = express.Router();
const tableRepository = require("../../repositories/tableRepository");
const tableValidator = require("../validators/tableValidator");

// Route to list all tables
router.get("/", async (req, res) => {
    try {
        const [tables] = await tableRepository.listTables();
        res.json(tables);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to create a new table
router.post("/", async(req, res) => {
    const parsedBody = tableValidator(req.body);

    if (parsedBody.error) {
        return res.status(400).json(parsedBody);
    }

    try {
        const result = await tableRepository.createTable(parsedBody.capacity);

        res.json({
            message: "Table created successfully",
            table: {
                id: result.insertId,
                seats: parsedBody.capacity
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Route to get a specific table by id
router.get("/:id", async(req, res) => {
    const id = req.params.id;

    try {
        const [table] = await tableRepository.getTable(id);
        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }
        res.json(table);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;