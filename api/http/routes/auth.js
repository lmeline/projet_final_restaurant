const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");

/**
 * @swagger
 * /auth/signup:
 *  post:
 *   summary: Inscrire un nouvel utilisateur
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required: [firstname, lastname, email, password]
 *       properties:
 *        firstname: { type: string, example: "Jean" }
 *        lastname: { type: string, example: "Dupont" }
 *        email: { type: string, example: "jean@example.com" }
 *        phone: { type: string, example: "0600000000" }
 *        password: { type: string, example: "Password1!" }
 *   responses:
 *    201: { description: Utilisateur créé }
 *    400: { description: Données invalides }
 *    409: { description: Utilisateur déjà existant }
 */
router.post("/signup", authController.signup);

/**
 * @swagger
 * /auth/login:
 *  post:
 *   summary: Se connecter pour obtenir un token
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required: [email, password]
 *       properties:
 *        email: { type: string, example: "jean@example.com" }
 *        password: { type: string, example: "Password1!" }
 *   responses:
 *    200:
 *     description: Connexion réussie, renvoie un token JWT
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *    400: { description: Format invalide }
 *    401: { description: Identifiants incorrects }
 *    404: { description: Utilisateur non trouvé }
 *    500: { description: Erreur serveur }
 */
router.post("/login", authController.login);

module.exports = router;
