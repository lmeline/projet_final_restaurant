const express = require("express");
const router = express.Router();
const menuController = require("../../controllers/menuController");

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Récupérer la carte du restaurant (avec filtres optionnels)
 *     tags: [Menu]
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filtrer par catégorie
 *         schema: { type: string, enum: [entree, plat, dessert] }
 *       - name: max-price
 *         in: query
 *         description: Prix maximum souhaité (en centimes)
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste du menu groupée par catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 entree: [{ id: 1, name: "Burrata Crémeuse", price_cents: 1100, category: "entree", is_available: true }]
 *                 plat: [{ id: 5, name: "Burger Maison", price_cents: 1850, category: "plat", is_available: true }]
 *       400: { description: Paramètres de filtrage invalides }
 *       500: { description: Erreur serveur }
 */
router.get("/", menuController.list);

module.exports = router;
