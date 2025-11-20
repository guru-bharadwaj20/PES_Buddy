import express from "express";
import { getAvailableScooters, bookScooter } from "../controllers/scootigoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/scooters", getAvailableScooters);
router.post("/book", protect, bookScooter);

export default router;
