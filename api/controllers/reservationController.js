const reservationRepository = require("../repositories/reservationRepository");
const { planAssignment } = require("../services/tableAssignmentService");
const { validateCreateReservationRequest, validateUpdateReservationRequest } = require("../http/validators/reservationValidator");
const queryValidator = require("../http/validators/utils/queryValidator");
const { formatDate, formatTime } = require("../utils/datetime");
const DomainError = require("../utils/DomainError");

function handleError(res, error) {
    if (error instanceof DomainError) {
        return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
}

async function list(req, res) {
    const params = queryValidator(req.query, {
        status: ["pending", "confirmed", "seated", "completed", "cancelled", "no_show"],
        date: "string",
    });
    if (params.error) {
        return res.status(400).json(params);
    }

    if (params.date && !/^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
        return res.status(400).json({ error: "Param `date` must be a date (YYYY-MM-DD)" });
    }

    try {
        const reservations = await reservationRepository.list(params);
        res.json(reservations);
    } catch (error) {
        handleError(res, error);
    }
}

async function listMine(req, res) {
    try {
        const reservations = await reservationRepository.findByUser(req.user.id);
        if (reservations.length === 0) {
            return res.status(404).json({ error: "No reservations found for this user" });
        }
        res.json(reservations);
    } catch (error) {
        handleError(res, error);
    }
}

async function getById(req, res) {
    try {
        const reservation = await reservationRepository.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.json(reservation);
    } catch (error) {
        handleError(res, error);
    }
}

async function create(req, res) {
    const validation = validateCreateReservationRequest(req.body);
    if (validation.error) {
        return res.status(400).json(validation);
    }

    const { number_of_people, date, time, comment } = validation;
    const userId = req.user.id;

    try {
        const plan = await planAssignment({ date, time, numberOfPeople: number_of_people });

        if (await reservationRepository.existsForUserAt(userId, plan.startsAt)) {
            return res.status(409).json({ error: "User already has a reservation at this time." });
        }

        const id = await reservationRepository.create({
            slotId: plan.slotId,
            userId,
            numberOfPeople: number_of_people,
            startsAt: plan.startsAt,
            endsAt: plan.endsAt,
            comment,
            tableIds: plan.tables.map((t) => t.id),
        });

        const reservation = await reservationRepository.findById(id);
        res.status(201).json({ message: "Reservation created successfully", reservation });
    } catch (error) {
        handleError(res, error);
    }
}

async function update(req, res) {
    const { id } = req.params;
    const validation = validateUpdateReservationRequest(req.body);
    if (validation.error) {
        return res.status(400).json(validation);
    }

    try {
        const current = await reservationRepository.findById(id);
        if (!current) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        if (!current.belongsTo(req.user.id) && req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        if (!current.isModifiable()) {
            return res.status(400).json({ error: "Only pending reservations can be modified" });
        }

        const numberOfPeople = validation.number_of_people ?? current.numberOfPeople;
        const date = validation.date ?? formatDate(current.startsAt);
        const time = validation.time ?? formatTime(current.startsAt);
        const comment = validation.comment !== undefined ? validation.comment : current.comment;

        const timingChanged =
            validation.number_of_people !== undefined ||
            validation.date !== undefined ||
            validation.time !== undefined;

        let fields = {
            numberOfPeople,
            startsAt: current.startsAt,
            endsAt: current.endsAt,
            slotId: current.slotId,
            comment,
        };
        let tableIds = null;

        if (timingChanged) {
            const plan = await planAssignment({
                date,
                time,
                numberOfPeople,
                excludeReservationId: id,
            });
            fields = { numberOfPeople, startsAt: plan.startsAt, endsAt: plan.endsAt, slotId: plan.slotId, comment };
            tableIds = plan.tables.map((t) => t.id);
        }

        await reservationRepository.update(id, fields, tableIds);

        const reservation = await reservationRepository.findById(id);
        res.json({ message: "Reservation updated successfully", reservation });
    } catch (error) {
        handleError(res, error);
    }
}

async function cancel(req, res) {
    const { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
        return res.status(400).json({ error: "Reservation ID is required and must be an integer" });
    }

    try {
        const affected = await reservationRepository.cancel(id);
        if (affected === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.json({ message: "Reservation cancelled successfully" });
    } catch (error) {
        handleError(res, error);
    }
}

async function confirm(req, res) {
    const { id } = req.params;
    try {
        const existing = await reservationRepository.findById(id);
        if (!existing) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        await reservationRepository.confirm(id);
        const reservation = await reservationRepository.findById(id);
        res.json({ message: "Reservation validated successfully", reservation });
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { list, listMine, getById, create, update, cancel, confirm };
