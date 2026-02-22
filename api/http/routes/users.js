const express = require("express");
const router = express.Router();
const userRepository = require("../../repositories/userRepository");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *       500:
 *         description: Erreur serveur
 */
router.get("/", async (req, res) => {
    try {
        const [users] = await userRepository.listUser();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

module.exports = router;