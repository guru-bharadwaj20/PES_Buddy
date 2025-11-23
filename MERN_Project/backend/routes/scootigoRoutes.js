import express from "express";
import { getAvailableScooters, bookScooter, getUserBookings } from "../controllers/scootigoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateScooterBooking } from "../middleware/validateInput.js";

const router = express.Router();

router.get("/scooters", getAvailableScooters);
router.post("/book", protect, validateScooterBooking, bookScooter);
router.get("/bookings", protect, getUserBookings);

export default router;
