const express = require("express");
const router = express.Router();
const userRepository = require("../../repositories/userRepository");
const PasswordHasher = require("../../utils/passwordHasher");
const {validateCreateUserRequest, validateLoginRequest} = require("../../http/validators/userValidator");
const { generateToken } = require("../../utils/jwtTokenManager");

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
        res.status(500).json({ error: error.message });
    }
})

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

        if (!PasswordHasher.comparePassword(password, user.password_hash)) {
            res.status(401).json({ error: "Invalid credentials" });
        } 

        res.status(200).json({
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;