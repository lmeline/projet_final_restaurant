const eventBus = require("../../eventBus");
const userRepository = require("../repositories/userRepository");
const PasswordHasher = require("../utils/passwordHasher");
const { generateToken } = require("../utils/jwtTokenManager");
const { validateCreateUserRequest, validateLoginRequest } = require("../http/validators/userValidator");

async function signup(req, res) {
    const validation = validateCreateUserRequest(req.body);
    if (validation.error) {
        return res.status(400).json(validation);
    }

    const { firstname, lastname, email, phone, password } = validation;

    try {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            return res.status(409).json({ error: "User already exists" });
        }

        const passwordHash = await PasswordHasher.hashPassword(password);
        const id = await userRepository.create({ firstname, lastname, email, phone, passwordHash });

        res.status(201).json({
            message: "User created",
            user: { id, email },
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

async function login(req, res) {
    const validation = validateLoginRequest(req.body);
    if (validation.error) {
        return res.status(400).json(validation);
    }

    const { email, password } = validation;

    try {
        eventBus.emit("auth:attempt", { email, ip: req.ip });

        const user = await userRepository.findByEmail(email);
        if (!user) {
            eventBus.emit("auth:failure", { email, ip: req.ip });
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatches = await PasswordHasher.comparePassword(password, user.passwordHash);
        if (!passwordMatches) {
            eventBus.emit("auth:failure", { email, ip: req.ip });
            return res.status(401).json({ error: "Invalid credentials" });
        }

        eventBus.emit("auth:success", { email, ip: req.ip });
        res.status(200).json({ token: generateToken(user.id, user.role, user.email) });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { signup, login };
