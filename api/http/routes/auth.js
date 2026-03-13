const express = require("express");
const eventBus = require("../../../eventBus");
const router = express.Router();
const userRepository = require("../../repositories/userRepository");
const PasswordHasher = require("../../utils/passwordHasher");
const {validateCreateUserRequest, validateLoginRequest} = require("../../http/validators/userValidator");
const { generateToken } = require("../../utils/jwtTokenManager");

/**
 * @swagger
 * /auth/signup:
 *  post:
 *   summary: Inscrire un nouvel utilisateur
 *   tags: 
 *    - Auth
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - firstname
 *        - lastname
 *        - email
 *        - password
 *       properties:
 *        firstname:
 *         type: string
 *         example: "Jean"
 *        lastname:
 *         type: string
 *         example: "Dupont"
 *        email:
 *         type: string
 *         example: "jean@exampl.com"
 *        phone:
 *         type: string
 *         example: "0600000000"
 *        password:
 *         type: string
 *         example: "password123"
 *   responses:
 *    201:
 *     description: Utilisateur créé
 *    400:
 *     description: Données invalides
 *    409:
 *     description: Utilisateur déjà existant
 */
router.post("/signup", async (req, res) => {
    let validationResult = validateCreateUserRequest(req.body);

    if (validationResult.error) {
        res.status(400).json(validationResult);
        return
    }
    const {firstname, lastname, email, phone, password} = validationResult;

    try {
        const [user] = await userRepository.getUserByEmail(email);
        if (user) {
            res.status(409).json({ error: "User already exists" });
            return;
        }

        const passwordHash = await PasswordHasher.hashPassword(password);

        let result = await userRepository.createUser(
            firstname, 
            lastname, 
            email, 
            phone || "NULL", 
            passwordHash
        );

        res.status(201).json({
            message: "User created",
            user: {
                id: result.insertId,
                email: email,
            }
        });
    } catch (error) {
        res.status(500).json({ error : "Internal Server Error" });
    }
})

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
 *       required:
 *        - email
 *        - password
 *       properties:
 *        email:
 *         type: string
 *         example: "jean.dupont@example.com"
 *        password:
 *         type: string
 *         example: "MonMotDePasseSecret123"
 *   responses:
 *    200:
 *     description: Connexion réussie, renvoie un token JWT
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - token
 *        properties:
 *         token:
 *          type: string
 *          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *    400:
 *     description: Format d'email ou mot de passe invalide
 *    401:
 *     description: Identifiants incorrects (mot de passe erroné)
 *    404:
 *     description: Utilisateur non trouvé
 *    500:
 *     description: Erreur serveur
 */
router.post("/login", async (req, res) => {
    let validationResult = validateLoginRequest(req.body);

    if (validationResult.error) {
        res.status(400).json(validationResult);
        return
    }
    const {email, password} = validationResult;

    

    try {
        const [user] = await userRepository.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        eventBus.emit("auth:attempt", {email: email, ip: req.ip});

        if (!PasswordHasher.comparePassword(password, user.password_hash)) {
            eventBus.emit("auth:failure", {email: email, ip: req.ip});
            res.status(401).json({ error: "Invalid credentials" });
        } 

        eventBus.emit("auth:success", {email: email, ip: req.ip});

        res.status(200).json({
            token: generateToken(user.id, user.role, user.email)
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;