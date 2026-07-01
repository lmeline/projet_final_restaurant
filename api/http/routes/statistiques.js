const express = require("express");
const router = express.Router();
const statController = require("../../controllers/statController");

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Récupérer les statistiques d'activité (Admin uniquement)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
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
 *                     total_reservations: { type: integer }
 *                     total_guests: { type: integer }
 *                     total_cancelled: { type: integer }
 *                     cancellation_rate: { type: number, format: float, example: 10.5 }
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date: { type: string, format: date }
 *                       daily_guests: { type: integer }
 *                 peakHours:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time: { type: string, example: "19:30:00" }
 *                       reservation_count: { type: integer }
 *       401: { description: Token manquant ou invalide }
 *       403: { description: Accès refusé - Droits administrateur requis }
 *       500: { description: Erreur interne du serveur }
 */
router.get("/", statController.overview);

module.exports = router;
