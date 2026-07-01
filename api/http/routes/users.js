const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs clients (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                   id: { type: integer, example: 3 }
 *                   firstname: { type: string, example: Thomas }
 *                   lastname: { type: string, example: Bernard }
 *                   phone: { type: string, example: "0622334455" }
 *                   email: { type: string, format: email, example: thomas.bernard@email.com }
 *                   role: { type: string, example: client }
 *       401: { description: Non authentifié }
 *       403: { description: Accès refusé - Droits administrateur requis }
 *       500: { description: Erreur serveur }
 */
router.get("/", userController.list);

module.exports = router;
