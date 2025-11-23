import express from "express";
import { getCanteens, getMenu, createOrder, getUserOrders, updateOrderStatus } from "../controllers/doormatoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateOrder } from "../middleware/validateInput.js";

const router = express.Router();

router.get("/canteens", getCanteens);
router.get("/menu/:canteenId", getMenu);
router.post("/order", protect, validateOrder, createOrder);
router.get("/orders", protect, getUserOrders);
router.patch("/order/:orderId/status", protect, updateOrderStatus);

export default router;
