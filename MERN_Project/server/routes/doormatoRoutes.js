import express from "express";
import { getCanteens, getMenu, createOrder } from "../controllers/doormatoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/canteens", getCanteens);
router.get("/menu/:canteenId", getMenu);
router.post("/order", protect, createOrder);

export default router;
