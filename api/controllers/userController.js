const userRepository = require("../repositories/userRepository");

async function list(req, res) {
    try {
        const users = await userRepository.listClients();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { list };
