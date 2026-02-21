const express = require("express");
const router = express.Router();
const menuRepository = require("../../repositories/menuRepository");
const queryValidator = require("../validators/utils/queryValidator");

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Récupérer la carte du restaurant (avec filtres optionnels)
 *     tags: [Menu]
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filtrer par catégorie (entree, plat, dessert)
 *         schema:
 *           type: string
 *           enum: [entree, plat, dessert]
 *       - name: max-price
 *         in: query
 *         description: Prix maximum souhaité
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste du menu groupée par catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 entree: [{ id: 1, name: "Salade", price: 12 }]
 *                 plat: [{ id: 5, name: "Steak", price: 25 }]
 *       400:
 *         description: Paramètres de filtrage invalides
 *       500:
 *         description: Erreur serveur
 */
router.get("/", async (req, res) => {
  let parsedParams = queryValidator(req.query, {
    category: ["entree", "plat", "dessert"],
    "max-price": "number",
  });

  if (parsedParams.error) {
    res.status(400).json(parsedParams);
    return;
  }

  try {
    const [menu] = await menuRepository.listMenu(parsedParams);

    let parsedMenu = {};
    menu.forEach((item) => {
      if (!parsedMenu[item.category]) {
        parsedMenu[item.category] = [];
      }
      parsedMenu[item.category].push(item);
    });$

    res.json(parsedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
