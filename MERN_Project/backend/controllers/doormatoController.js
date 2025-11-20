import Canteen from "../models/Canteen.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";

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

