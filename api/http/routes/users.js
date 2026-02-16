const express = require("express");
const router = express.Router();
const userRepository = require("../../repositories/userRepository");

router.get("/", async (req, res) => {
    try {
        const [users] = await userRepository.listUser();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

module.exports = router;