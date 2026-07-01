const express = require("express");
const router = express.Router();
const tableController = require("../../controllers/tableController");

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Récupérer la liste de toutes les tables (Admin uniquement)
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
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
 *                   id: { type: integer }
 *                   label: { type: string, example: "T3" }
 *                   seats: { type: integer }
 *                   is_active: { type: boolean }
 *       500: { description: Erreur serveur }
 */
router.get("/", tableController.list);

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Créer une nouvelle table (Admin uniquement)
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [capacity]
 *             properties:
 *               capacity: { type: integer, example: 4 }
 *               label: { type: string, example: "T13" }
 *     responses:
 *       201:
 *         description: Table créée avec succès
 *       400: { description: Données de la table invalides }
 *       500: { description: Erreur serveur }
 */
router.post("/", tableController.create);

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Récupérer une table par son ID (Admin uniquement)
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Détails de la table récupérés }
 *       404: { description: Table non trouvée }
 *       500: { description: Erreur serveur }
 */
router.get("/:id", tableController.getById);

module.exports = router;
