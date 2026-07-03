const express = require("express");
const router = express.Router();
const reservationController = require("../../controllers/reservationController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 18 }
 *         slot_id: { type: integer, example: 5 }
 *         user_id: { type: integer, example: 12 }
 *         number_of_people: { type: integer, example: 4 }
 *         starts_at: { type: string, format: date-time, example: "2026-03-15 19:30:00" }
 *         ends_at: { type: string, format: date-time, example: "2026-03-15 21:30:00" }
 *         status: { type: string, enum: [pending, confirmed, seated, completed, cancelled, no_show] }
 *         comment: { type: string, example: "Près de la fenêtre" }
 *         cancelled_at: { type: string, format: date-time, nullable: true }
 *         tables:
 *           type: array
 *           items: { type: integer }
 *           example: [2, 5]
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Liste toutes les réservations (Admin uniquement)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema: { type: string, enum: [pending, confirmed, seated, completed, cancelled, no_show] }
 *       - name: date
 *         in: query
 *         description: Filtrer par date (YYYY-MM-DD)
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reservation' }
 *       400: { description: Paramètres de requête invalides }
 *       401: { description: Non authentifié }
 *       403: { description: Accès refusé - Droits administrateur requis }
 *       500: { description: Erreur serveur }
 */
router.get("/", adminMiddleware, reservationController.list);

/**
 * @swagger
 * /reservations/my-reservations:
 *   get:
 *     summary: Récupérer ses propres réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reservation' }
 *       404: { description: Aucune réservation trouvée pour cet utilisateur }
 *       500: { description: Erreur serveur }
 */
router.get("/my-reservations", reservationController.listMine);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [number_of_people, date, time]
 *             properties:
 *               number_of_people: { type: integer, example: 4 }
 *               date: { type: string, format: date, example: "2026-03-25" }
 *               time: { type: string, example: "19:30" }
 *               comment: { type: string, example: "Près de la fenêtre, merci." }
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400: { description: Erreur de validation ou restaurant fermé }
 *       401: { description: Authentification requise }
 *       409: { description: Pas de table disponible ou réservation déjà existante }
 *       500: { description: Erreur serveur }
 */
router.post("/", reservationController.create);

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Modifier une réservation existante (en attente uniquement)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number_of_people: { type: integer, example: 4 }
 *               date: { type: string, format: date, example: "2026-03-15" }
 *               time: { type: string, example: "19:30" }
 *               comment: { type: string, example: "Anniversaire" }
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *       400: { description: Données invalides ou réservation non modifiable }
 *       403: { description: Accès refusé (ce n'est pas votre réservation) }
 *       404: { description: Réservation non trouvée }
 *       409: { description: Pas de tables disponibles pour ce créneau }
 *       500: { description: Erreur serveur }
 */
router.put("/:id", reservationController.update);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Annuler une réservation (Admin ou client propriétaire)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Réservation annulée avec succès }
 *       400: { description: ID invalide }
 *       403: { description: Accès refusé (ce n'est pas votre réservation) }
 *       404: { description: Réservation non trouvée }
 *       500: { description: Erreur serveur }
 */
router.delete("/:id", authMiddleware, reservationController.cancel);

/**
 * @swagger
 * /reservations/{id}/validate:
 *   patch:
 *     summary: Valider une réservation (Admin uniquement)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Réservation validée avec succès }
 *       404: { description: Réservation non trouvée }
 *       500: { description: Erreur serveur }
 */
router.patch("/:id/validate", adminMiddleware, reservationController.confirm);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Récupérer une réservation par son ID (Admin uniquement)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Réservation récupérée avec succès
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reservation' }
 *       404: { description: Réservation non trouvée }
 *       500: { description: Erreur serveur }
 */
router.get("/:id", adminMiddleware, reservationController.getById);

module.exports = router;
