const express = require("express");
const router = express.Router();
const reservationRepository = require("../../repositories/reservationRepository");

router.get("/", async (req, res) => {
    try {
        const [reservations] = await reservationRepository.listReservations();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});


// TODO : Change to /my-reservation and get user_id from token
router.get("/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const [reservation] = await reservationRepository.getReservation(user_id);
        if (reservation.length === 0) {
            res.status(404).json({ error: "Reservation not found" });
        } else {
            res.json(reservation);
        } 
    } catch (error) {
            res.status(500).json({ error: error.message });
    }}
);

// TODO : Get user_id from token
router.post("/", async (req, res) => {
    const { user_id, number_of_people, date, time, note } = req.body;
    try {
        const reservation = await reservationRepository.createReservation(user_id, number_of_people, date, time, note);
        res.status(201).json({ message: "Reservation created successfully", reservation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Methods for updating a reservation
router.put("/:id", async (req, res) => {
    const { id } = req.params; 
    const updates = req.body;  

    try {
        const result = await reservationRepository.updateReservation(id, updates);
        res.json({
            message: "Reservation updated successfully",
            affectedRows: result.affectedRows
       });
    } catch (error) {
        if (error.message === "Reservation not found") {
            res.status(404).json({ error: error.message });
        } else if (error.message === "Only pending reservations can be modified") {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await reservationRepository.deleteReservation(id);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Reservation not found" });
        } else {
            res.json({ message: "Reservation deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch ("/:id/validate", async (req, res) => {
    const id = req.params.id;
    try {
        const reservation = await reservationRepository.validateReservation(id);
        res.json({ message: "Reservation validated successfully", reservation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;