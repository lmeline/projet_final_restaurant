const express = require("express");
const router = express.Router();
const tableRepository = require("../../repositories/tableRepository");
const { checkTablesAvailability, validateCreateTableRequest } = require("../validators/tableValidator");
const eventBus = require("../../../eventBus");

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Récupérer la liste de toutes les tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: Liste des tables récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   number:
 *                     type: integer
 *                   capacity:
 *                     type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get("/", async (req, res) => {
    try {
        const [tables] = await tableRepository.listTables();
        res.json(tables);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Créer une nouvelle table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - capacity
 *             properties:
 *               capacity:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Table créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 table:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     seats:
 *                       type: integer
 *       400:
 *         description: Données de la table invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", async(req, res) => {
    const parsedBody = validateCreateTableRequest(req.body);

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
    eventBus.emit("table:creation", {id: result.insertId, capacity: parsedBody.capacity,  });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Récupérer une table par son ID
 *     tags: [Tables]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'identifiant unique de la table
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la table récupérés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 capacity:
 *                   type: integer
 *       404:
 *         description: Table non trouvée
 *       500:
 *         description: Erreur serveur
 */
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