const express = require("express");
const router = express.Router();
const menuRepository = require("../../repositories/menuRepository");

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get the menu
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: The menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     entree:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           category:
 *                             type: string
 *                         example: 
 *                           id: 1
 *                           name: Salade verte
 *                           description: Salade verte maison
 *                           price: 5
 *                           category: entree
 *       500:
 *         description: Internal server error
 */


router.get("/", async (req, res) => {
  try {
    const [menu] = await menuRepository.listMenu();

    let parsedMenu = {};
    menu.forEach((item) => {
      if (!parsedMenu[item.category]) {
        parsedMenu[item.category] = [];
      }
      parsedMenu[item.category].push(item);
    });
    res.json(parsedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
