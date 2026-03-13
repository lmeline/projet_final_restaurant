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
 *                     example: 3
 *                   firstname:
 *                     type: string
 *                     example: Thomas
 *                   lastname:
 *                     type: string
 *                     example: Bernard
 *                   phone:
 *                     type: string
 *                     example: "0622334455"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: thomas.bernard@email.com
 *                   role:
 *                     type: string
 *                     example: client
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