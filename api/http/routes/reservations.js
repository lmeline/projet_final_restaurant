const express = require("express");
const router = express.Router();
const reservationRepository = require("../../repositories/reservationRepository");
const tableRepository = require("../../repositories/tableRepository");
const adminMiddleware = require("../middlewares/admin");
const clientMiddleware = require("../middlewares/client");
const {validateCreateReservationRequest, validateUpdateReservationRequest} = require("../validators/reservationValidator");
const queryValidator = require("../validators/utils/queryValidator");
const assignTables = require("../../utils/tableAssigner");
const eventBus = require("../../../eventBus");
const e = require("express");

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
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 18
 *                   number_of_people:
 *                     type: integer
 *                     example: 10
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-12T23:00:00.000Z"
 *                   time:
 *                     type: string
 *                     example: "12:07:00"
 *                   status:
 *                     type: string
 *                     enum: [pending, confirmed, cancelled]
 *                     example: confirmed
 *                   comment:
 *                     type: string
 *                     example: Test reservation
 *                   user_id:
 *                     type: integer
 *                     example: 12
 *                   tables:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [1, 6]
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
      
      reservations = reservations.map(({ tables_id, ...rest }) => ({
          ...rest,
          tables: tables_id ? tables_id.split(',').map(Number) : []
      }));
      
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
 *         description: Liste des réservations récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 18
 *                   number_of_people:
 *                     type: integer
 *                     example: 10
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-12T23:00:00.000Z"
 *                   time:
 *                     type: string
 *                     example: "12:07:00"
 *                   status:
 *                     type: string
 *                     enum: [pending, confirmed, cancelled]
 *                     example: confirmed
 *                   comment:
 *                     type: string
 *                     example: Test reservation
 *                   user_id:
 *                     type: integer
 *                     example: 12
 *                   tables:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [1, 6]
 *       404:
 *         description: Aucune réservation trouvée pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get("/my-reservations", async (req, res) => {
    const user_id = req.user.id;
    try {
      let reservations = await reservationRepository.getReservationsForUser(user_id);
      eventBus.emit("reservation:my-reservations:success", {user_id:user_id});

      if (reservations.length === 0) {
        eventBus.emit("reservation:my-reservations:failure", {StatusCode: 404, error: "No reservations found for this user"});
        return res.status(404).json({ error: "No reservations found for this user" });
      }
      
      reservations = reservations.map(({ tables_id, ...rest }) => ({
          ...rest,
          tables: tables_id ? tables_id.split(',').map(Number) : []
      }));
      
      res.json(reservations);
    } catch (error) {
        eventBus.emit("reservation:my-reservations:failure", {StatusCode: 500, error: error.message});
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
        eventBus.emit("reservation:create:failure", {StatusCode: 400, error: validationResult.error});
        return res.status(400).json(validationResult);
    }

    const { number_of_people, date, time, note } = req.body;
    const user_id = req.user.id;

  try {

    const restaurantIsOpen = await reservationRepository.checkOpenSlotAvailability(date, time);
    if (!restaurantIsOpen) {
      eventBus.emit("reservation:create:failure", {StatusCode: 400, error: "Restaurant is closed at this time."});
      return res.status(400).json({ error: "Restaurant is closed at this time." });
    }
      
    const availableTables = await tableRepository.getAvailableTables(date, time);
    if (!availableTables) {
      eventBus.emit("reservation:create:failure", {StatusCode: 409, error: "Restaurant is full for this time slot."});
      return res.status(409).json({ error: "Restaurant is full for this time slot." });
    }
  
    const assignedTables = assignTables(availableTables, number_of_people);
    if (!assignedTables) {
      eventBus.emit("reservation:create:failure", {StatusCode: 409, error: "No available tables for this number of people."});
      return res.status(409).json({ error: "No available tables for this number of people." });
    }

    const reservation_id = await reservationRepository.createReservation(user_id, number_of_people, date, time, note, assignedTables);
    const [reservation] = await reservationRepository.getReservationById(reservation_id.id)

    const { tables_id, ...data } = reservation;
    
    eventBus.emit("reservation:create:success", {
      reservationId: reservation_id.id,
      email: req.user.email,
      date,
      time,
      numberOfPeople: number_of_people,
      ip: req.ip
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: {
        ...data,
        tables: tables_id ? tables_id.split(',').map(Number) : []
      }
    });

  } catch (error) {
    const status = error.status || 500;
    eventBus.emit("reservation:create:failure", {StatusCode: status, error: error.message});
    res.status(status).json({ error: error.message });
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
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number_of_people:
 *                 type: integer
 *                 example: 4
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-15"
 *               time:
 *                 type: string
 *                 example: "19:30:00"
 *               comment:
 *                 type: string
 *                 example: "Anniversaire"
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
 *                   example: Reservation updated successfully
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 18
 *                     number_of_people:
 *                       type: integer
 *                       example: 4
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-03-15T00:00:00.000Z"
 *                     time:
 *                       type: string
 *                       example: "19:30:00"
 *                     status:
 *                       type: string
 *                       example: pending
 *                     comment:
 *                       type: string
 *                       example: Anniversaire
 *                     user_id:
 *                       type: integer
 *                       example: 12
 *                     tables:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [2, 5]
 *       400:
 *         description: Données invalides ou réservation non modifiable
 *       403:
 *         description: Accès refusé (ce n'est pas votre réservation)
 *       404:
 *         description: Réservation non trouvée
 *       409:
 *         description: Pas de tables disponibles pour ce créneau
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params; 
    const newReservation = validateUpdateReservationRequest(req.body);
    
    if (newReservation.error) {
        eventBus.emit("reservation:modify:failure", {StatusCode: 400, error: newReservation.error});
        return res.status(400).json(newReservation);
    }

    const user_id = req.user.id;

    try {
      const [currentReservation] = await reservationRepository.getReservationById(id);

      if (!currentReservation) {
        eventBus.emit("reservation:modify:failure", {StatusCode: 404, error: "Reservation not found"});
        return res.status(404).json({ error: "Reservation not found" });
      }

      if (currentReservation.user_id !== user_id && req.user.role !== "admin") {
        eventBus.emit("reservation:modify:failure", {StatusCode: 403, error: "Access denied"});
        return res.status(403).json({ error: "Access denied" });
      }

      if (currentReservation.status !== "pending") {
        eventBus.emit("reservation:modify:failure", {StatusCode: 400, error: "Only pending reservations can be modified"});
        return res.status(400).json({ error: "Only pending reservations can be modified" });
      }
      let assignedTables = null;
        
      if (currentReservation.date !== newReservation.date
        || currentReservation.time !== newReservation.time
        || currentReservation.number_of_people !== newReservation.number_of_people
      ) {
        const restaurantIsOpen = await reservationRepository.checkOpenSlotAvailability(newReservation.date, newReservation.time);
        if (!restaurantIsOpen) {
          eventBus.emit("reservation:modify:failure", {StatusCode: 400, error: "Restaurant is closed at this time."});
          return res.status(400).json({ error: "Restaurant is closed at this time." });
        }

        const availableTables = await tableRepository.getAvailableTables(newReservation.date, newReservation.time, id);

        if (!availableTables) {
          eventBus.emit("reservation:modify:failure", {StatusCode: 409, error: "Restaurant is full for this time slot."});
          return res.status(409).json({ error: "Restaurant is full for this time slot." });
        }

        assignedTables = assignTables(availableTables, newReservation.number_of_people)
        
        if (!assignedTables) {
          eventBus.emit("reservation:modify:failure", {StatusCode: 409, error: "No available tables for this number of people."});
          return res.status(409).json({ error: "No available tables for this number of people." });
        }
      }

      await reservationRepository.updateReservation(id, newReservation, assignedTables);

      const [updatedReservation] = await reservationRepository.getReservationById(id);

      const {tables_id, ...data} = updatedReservation;

      res.json({
          message: "Reservation updated successfully",
          reservation: {
            ...data,
            tables: tables_id ? tables_id.split(',').map(Number) : []
          }
      });

      eventBus.emit("reservation:modify:success", {
        reservationId: id,
        email: req.user.email,
        date: newReservation.date,
        time: newReservation.time,
        numberOfPeople: newReservation.number_of_people,
        ip: req.ip
      })
    } catch (_) {
      const status = error.status || 500;
      eventBus.emit("reservation:failure", {StatusCode: status, error: "Internal server error"});
      res.status(status).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Annuler une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'identifiant de la réservation à annuler
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation annulée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation cancelled successfully"
 *       404:
 *         description: Réservation non trouvée ou vous n'avez pas le droit de l'annuler
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", adminMiddleware, async (req, res) => {
    const id = req.params.id;

    if (!id || Number.isNaN(Number(id))) {
        return res.status(400).json({ error: "Reservation ID is required and must be a integer" });
    }

    try {
        const result = await reservationRepository.deleteReservation(id);
        if (result.affectedRows === 0) {
            res.status(404).json({StatusCode: 404, error: "Reservation not found" });
            eventBus.emit("reservation:cancel:failed", { reservation_id: id });
        } else {
            res.json({ message: "Reservation cancelled successfully" });
           eventBus.emit("reservation:cancel:success", { reservationId: id });

        }
    } catch (error) {
        eventBus.emit("reservation:cancel:failed", {StatusCode: 500, error: error.message });
        res.status(500).json({ error: "Internal server error" });
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
 *           type: integer
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
 *                   example: Reservation validated successfully
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 18
 *                     number_of_people:
 *                       type: integer
 *                       example: 10
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-03-12T23:00:00.000Z"
 *                     time:
 *                       type: string
 *                       example: "12:07:00"
 *                     status:
 *                       type: string
 *                       example: confirmed
 *                     comment:
 *                       type: string
 *                       example: Test reservation
 *                     user_id:
 *                       type: integer
 *                       example: 12
 *                     tables:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 6]
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/validate", adminMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const [reservation] = await reservationRepository.validateReservation(id);
        const {tables_id, ...data} = reservation

        res.json({ 
          message: "Reservation validated successfully", 
          reservation : {
            ...data,
            tables: tables_id ? tables_id.split(',').map(Number) : []
          }
         });
         eventBus.emit("reservation:validate:success", { reservationId: id });
    } catch (error) {
        if (error.message === "Reservation not found") {
            eventBus.emit("reservation:validate:failure", {StatusCode: 404, error: error.message });
            res.status(404).json({ error: "Reservation not found" });
        } else {
            const status = error.status || 500;
            eventBus.emit("reservation:validate:failure", {StatusCode: status, error: error.message });
            res.status(status).json({ error: "internal server error" });
        }
    }
});

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
 *         description: L'ID de la réservation à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réservation récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 18
 *                 number_of_people:
 *                   type: integer
 *                   example: 10
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-12T23:00:00.000Z"
 *                 time:
 *                   type: string
 *                   example: "12:07:00"
 *                 status:
 *                   type: string
 *                   example: "confirmed"
 *                 comment:
 *                   type: string
 *                   example: "Test reservation"
 *                 user_id:
 *                   type: integer
 *                   example: 12
 *                 tables:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 6]
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", adminMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const [reservation] = await reservationRepository.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const { tables_id, ...data } = reservation;

    res.status(200).json({
      ...data,
      tables: tables_id ? tables_id.split(',').map(Number) : []
    });
  } catch (_) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;