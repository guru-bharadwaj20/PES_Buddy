import express from "express";
import { getCanteens, getMenu, createOrder, getUserOrders, updateOrderStatus } from "../controllers/doormatoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/canteens", getCanteens);
router.get("/menu/:canteenId", getMenu);
router.post("/order", protect, createOrder);
router.get("/orders", protect, getUserOrders);
router.patch("/order/:orderId/status", protect, updateOrderStatus);

export default router;
