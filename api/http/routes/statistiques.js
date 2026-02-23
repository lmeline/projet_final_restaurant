const express = require("express");
const router = express.Router();
const { validateStatRequest } = require("../validators/statValidator");
const StatRepository = require("../../repositories/statRepository");
const pool = require("../../repositories/config/db");
const statRepository = new StatRepository(pool);

/**
 * @swagger
 * /statistiques:
 * get:
 * summary: Voir les statistiques du restaurant (Admin uniquement)
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 */
router.get("/", async (req, res) => {
    const validation = validateStatRequest(req.query);
    if (validation.error) return res.status(400).json(validation);

    try {
        const globalStats = await statRepository.getGlobalStats();
        const dailyStats = await statRepository.getClientsPerDay();
        const peakHours = await statRepository.getPeakHours();

        res.json({
            summary: globalStats,
            details: dailyStats,
            peakHours: peakHours,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;