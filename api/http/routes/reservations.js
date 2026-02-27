const express = require("express");
const router = express.Router();
const reservationRepository = require("../../repositories/reservationRepository");
const tableRepository = require("../../repositories/tableRepository");
const adminMiddleware = require("../middlewares/admin");
const clientMiddleware = require("../middlewares/client");
const {validateCreateReservationRequest, validateUpdateReservationRequest} = require("../validators/reservationValidator");
const queryValidator = require("../validators/utils/queryValidator");
const assignTables = require("../../utils/tableAssigner");

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
 *         description: Filtrer par statut
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *       - name: date
 *         in: query
 *         description: Filtrer par date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Paramètres de requête invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       500:
 *         description: Erreur serveur
 */
router.get("/", adminMiddleware, async (req, res) => {
    let parsedParams = queryValidator(req.query, {
      status: ["pending", "confirmed", "cancelled"],
      date: "date"
    })

    if (parsedParams.error) {
      return res.status(400).json(parsedParams) ;
    }
    try {
      let [reservations] = await reservationRepository.listReservations(parsedParams);
      
      reservations = reservations.map(reservation => ({
          ...reservation,
          tables: reservation.tables_id.split(',').map(Number)
      }))
      
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    } 
});


/**
 * @swagger
 * /my-reservations:
 *   get:
 *     summary: Récupérer mes propres réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Aucune réservation trouvée pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get("/my-reservations", async (req, res) => {
    const user_id = req.user.id || req.user.userId;
    try {
      let reservations = await reservationRepository.getReservationsForUser(user_id);
      
      if (reservations.length === 0) {
        return res.status(404).json({ error: "No reservations found for this user" });
      }
      
      reservations = reservations.map(reservation => ({
          ...reservation,
          tables: reservation.tables_id.split(',').map(Number)
      }))
      
      res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Créer une nouvelle réservation (Client uniquement)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number_of_people
 *               - date
 *               - time
 *             properties:
 *               number_of_people:
 *                 type: integer
 *                 example: 4
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-25"
 *               time:
 *                 type: string
 *                 example: "19:30"
 *               note:
 *                 type: string
 *                 example: "Près de la fenêtre, merci."
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation created successfully"
 *                 reservationId:
 *                   type: integer
 *                 tablesAssigned:
 *                   type: array
 *       400:
 *         description: Erreur de validation ou données invalides
 *       401:
 *         description: Authentification requise
 *       500:
 *         description: Erreur serveur
 */
router.post("/", async (req, res) => {
    const validationResult = validateCreateReservationRequest(req.body);

    if (validationResult.error) {
        return res.status(400).json(validationResult);
    }

    const { number_of_people, date, time, note } = req.body;
    const user_id = req.user.id || req.user.userId;

  try {

    const restaurantIsOpen = await reservationRepository.checkOpenSlotAvailability(date, time);
    if (!restaurantIsOpen) {
      return res.status(400).json({ error: "Restaurant is closed at this time." });
    }
      
    const availableTables = await tableRepository.getAvailableTables(date, time);
    if (!availableTables) {
      return res.status(409).json({ error: "Restaurant is full for this time slot." });
    }
      
    const assignedTables = assignTables(availableTables, number_of_people);
    if (!assignedTables) {
      return res.status(409).json({ error: "No available tables for this number of people." });
    }
    
    const reservation_id = await reservationRepository.createReservation(user_id, number_of_people, date, time, note, assignedTables);
    const reservation = await reservationRepository.getReservationsForUser(reservation_id.id)

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: reservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Modifier une réservation existante
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'identifiant de la réservation à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number_of_people:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 affectedRows:
 *                   type: integer
 *       400:
 *         description: Données invalides ou réservation non modifiable
 *       403:
 *         description: Accès refusé (ce n'est pas votre réservation)
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params; 
    const newReservation = validateUpdateReservationRequest(req.body);

    if (newReservation.error) {
        return res.status(400).json(newReservation);
    }

    const user_id = req.user.id || req.user.userId;

    try {
      const currentReservation = await reservationRepository.getReservationById(id);
      
      if (!currentReservation) {
        throw new Error("Reservation not found")
      }
        
      if (currentReservation.user_id !== user_id) {
        throw new Error("Access denied");
      }
        
      if (currentReservation.status !== "pending") {
        throw new Error("Only pending reservations can be modified");
      }
      
      let assignedTables = null;
        
      if (currentReservation.date !== newReservation.date
        || currentReservation.time !== newReservation.time
        || currentReservation.number_of_people !== newReservation.number_of_people
      ) {
        const restaurantIsOpen = await reservationRepository.checkOpenSlotAvailability(newReservation.date, newReservation.time);
        if (!restaurantIsOpen) {
          return res.status(400).json({ error: "Restaurant is closed at this time." });
        }
            
        const availableTables = await tableRepository.getAvailableTables(newReservation.date, newReservation.time, id);
        if (!availableTables) {
          return res.status(409).json({ error: "Restaurant is full for this time slot." });
        }
        
        assignedTables = assignTables(availableTables, number_of_people)
        if (!assignedTables) {
          return res.status(409).json({ error: "No available tables for this number of people." });
        }
      }
        
      await reservationRepository.updateReservation(id, newReservation, assignedTables);
      
      const updatedReservation = await reservationRepository.getReservationById(id);
      res.json({
          message: "Reservation updated successfully",
          reservation: updatedReservation
      });
    } catch (_) {
      res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'identifiant de la réservation à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation deleted successfully"
 *       404:
 *         description: Réservation non trouvée ou vous n'avez pas le droit de la supprimer
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", adminMiddleware, async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "Reservation ID is required" });
    }

    const user_id = req.user.id || req.user.userId;
    try {
        const result = await reservationRepository.deleteReservation(id, user_id);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Reservation not found or access denied" });
        } else {
            res.json({ message: "Reservation deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
 *         description: L'ID de la réservation à confirmer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation validée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reservation:
 *                   type: object
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch ("/:id/validate", adminMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const reservation = await reservationRepository.validateReservation(id);
        res.json({ message: "Reservation validated successfully", reservation });
    } catch (error) {
        if (error.message === "Reservation not found") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;