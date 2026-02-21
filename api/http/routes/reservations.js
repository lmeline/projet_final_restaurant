const express = require("express");
const router = express.Router();
const reservationRepository = require("../../repositories/reservationRepository");
const adminMiddleware = require("../middlewares/admin");
const clientMiddleware = require("../middlewares/client");
const {validateCreateReservationRequest, validateUpdateReservationRequest } = require("../validators/reservationValidator");
const queryValidator = require("../validators/utils/queryValidator");

// Route to list all reservations, only accessible by admin
router.get("/", adminMiddleware, async (req, res) => {
    let parsedParams = queryValidator(req.query, {
        status: ["pending", "confirmed", "cancelled"],
        date: "date"
    })

    if (parsedParams.error) {
        res.status(400).json(parsedParams);
        return;
    }
    try {
        const [reservations] = await reservationRepository.listReservations(parsedParams);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});


// Route to get specific reservation for the id of the user
router.get("/my-reservations", async (req, res) => {
    const user_id = req.user.id || req.user.userId;
    try {
        const [reservation] = await reservationRepository.getReservation(user_id);
         if (reservation.length === 0) {
            return res.status(404).json({ error: "No reservations found for this user" });
        } 
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for creating a reservation, only accessible by clients
router.post("/", clientMiddleware, async (req, res) => {
    const validationResult = validateCreateReservationRequest(req.body);

    if (validationResult.error) {
        return res.status(400).json(validationResult);
    }

    const { number_of_people, date, time, note } = req.body;
    const user_id = req.user.id || req.user.userId;

    try {
        const reservation = await reservationRepository.createReservation(user_id, number_of_people, date, time, note);
        res.status(201).json({ message: "Reservation created successfully", reservation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route for updating a reservation
router.put("/:id", async (req, res) => {
    const { id } = req.params; 
    const validationResult = validateUpdateReservationRequest(req.body);

    if (validationResult.error) {
        return res.status(400).json(validationResult);
    }

    const user_id = req.user.id || req.user.userId;

    try {
        const result = await reservationRepository.updateReservation(id, validationResult, user_id);
        res.json({
            message: "Reservation updated successfully",
            affectedRows: result.affectedRows
       });
    } catch (error) {
        if (error.message === "Reservation not found") {
            res.status(404).json({ error: error.message });
        } else if (error.message === "Only pending reservations can be modified") {
            res.status(400).json({ error: error.message });
        }  else if (error.message === "Access denied") {
            res.status(403).json({ error: "You can only update your own reservations" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Route for deleting a reservation
router.delete("/:id", async (req, res) => {
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

// Route for validating a reservation
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