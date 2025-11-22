import Canteen from "../models/Canteen.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import { createNotification } from "./notificationController.js";

export const getCanteens = async (req, res) => {
	try {
		const canteens = await Canteen.find().lean();
		res.json(canteens);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const getMenu = async (req, res) => {
	try {
		const { canteenId } = req.params;
		const items = await MenuItem.find({ canteen: canteenId }).lean();
		res.json(items);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const createOrder = async (req, res) => {
	try {
		const user = req.user;
		const { canteenName, items } = req.body; // items: [{ menuItem, qty }]
		if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "No items in order" });

		// Build order items and calculate total
		const orderItems = [];
		let total = 0;
		for (const it of items) {
			const menuItem = await MenuItem.findById(it.menuItem).populate('canteen');
			if (!menuItem) continue;
			const qty = it.qty && it.qty > 0 ? it.qty : 1;
			orderItems.push({ 
				menuItem: menuItem._id, 
				name: menuItem.name, 
				price: menuItem.price, 
				quantity: qty,
				canteen: menuItem.canteen?._id 
			});
			total += menuItem.price * qty;
		}

		if (orderItems.length === 0) return res.status(400).json({ message: "No valid items found" });

		const order = await Order.create({ 
			user: user._id, 
			canteenName: canteenName || "", 
			items: orderItems, 
			total,
			totalAmount: total 
		});
		
		// Create notification for user
		await createNotification(
			user._id,
			'order',
			'Order Placed',
			`Your order from ${canteenName} for ₹${total.toFixed(2)} has been placed successfully. Waiting for confirmation.`,
			order._id,
			'🍔'
		);
		
		// Emit real-time order notification
		const io = req.app.get("io");
		if (io) {
			io.emit("order:new", {
				orderId: order._id,
				userId: user._id,
				userName: user.name,
				canteenName,
				total,
				itemCount: orderItems.length,
				timestamp: new Date()
			});
		}
		
		res.status(201).json(order);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const getUserOrders = async (req, res) => {
	try {
		const user = req.user;
		const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).lean();
		res.json(orders);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const updateOrderStatus = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { status, rejectionReason } = req.body;
		
		if (!['accepted', 'rejected', 'preparing', 'completed', 'cancelled'].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}
		
		const updateData = { status };
		if (status === 'rejected' && rejectionReason) {
			updateData.rejectionReason = rejectionReason;
		}
		
		const order = await Order.findByIdAndUpdate(
			orderId,
			updateData,
			{ new: true }
		).populate('user', 'name srn');
		
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}
		
		// Create notification for user
		let notificationTitle = 'Order Updated';
		let notificationMessage = '';
		let notificationIcon = '🔔';
		
		if (status === 'accepted') {
			notificationTitle = 'Order Accepted';
			notificationMessage = 'Great news! Your order has been accepted and is being prepared.';
			notificationIcon = '✅';
		} else if (status === 'rejected') {
			notificationTitle = 'Order Rejected';
			notificationMessage = `Sorry, your order was rejected. Reason: ${order.rejectionReason || 'Not specified'}`;
			notificationIcon = '❌';
		} else if (status === 'preparing') {
			notificationTitle = 'Order Being Prepared';
			notificationMessage = 'Your order is now being prepared.';
			notificationIcon = '👨‍🍳';
		} else if (status === 'completed') {
			notificationTitle = 'Order Completed';
			notificationMessage = 'Your order is ready for pickup!';
			notificationIcon = '✓';
		}
		
		await createNotification(
			order.user._id,
			'order',
			notificationTitle,
			notificationMessage,
			order._id,
			notificationIcon
		);
		
		// Emit real-time order status update
		const io = req.app.get("io");
		if (io) {
			io.emit("order:status", {
				orderId: order._id,
				userId: order.user._id,
				status: order.status,
				rejectionReason: order.rejectionReason,
				timestamp: new Date()
			});
			// Emit notification event to specific user
			io.to(`user:${order.user._id}`).emit('notification:new', {
				title: notificationTitle,
				message: notificationMessage,
				icon: notificationIcon
			});
		}
		
		res.json(order);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

