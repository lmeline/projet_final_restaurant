const express = require("express");
const router = express.Router();
const StatRepository = require("../../repositories/statRepository");
const pool = require("../../repositories/config/db");
const statRepository = new StatRepository(pool);

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Récupérer les statistiques d'activité (Admin uniquement)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total_reservations:
 *                       type: integer
 *                     total_guests:
 *                       type: integer
 *                     total_cancelled:
 *                       type: integer
 *                     cancellation_rate:
 *                       type: number
 *                       format: float
 *                       example: 10.5
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       daily_guests:
 *                         type: integer
 *                       peakHours:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             time:
 *                               type: string
 *                               example: "19:30:00"
 *                             reservation_count:
 *                               type: integer
 *       400:
 *         description: Format de date invalide
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", async (req, res) => {
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