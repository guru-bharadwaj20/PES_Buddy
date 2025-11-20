import express from 'express';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all orders (admin only)
router.get('/orders', protect, async (req, res) => {
	try {
		const orders = await Order.find()
			.populate('user', 'name srn email')
			.populate({
				path: 'items.canteen',
				select: 'name'
			})
			.sort({ createdAt: -1 });
		
		res.json(orders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ message: 'Failed to fetch orders' });
	}
});

// Get all bookings (admin only)
router.get('/bookings', protect, async (req, res) => {
	try {
		const bookings = await Booking.find()
			.populate('user', 'name srn email')
			.populate('scooter', 'scooterId vehicleNumber')
			.sort({ createdAt: -1 });
		
		res.json(bookings);
	} catch (error) {
		console.error('Error fetching bookings:', error);
		res.status(500).json({ message: 'Failed to fetch bookings' });
	}
});

// Get order statistics
router.get('/stats/orders', protect, async (req, res) => {
	try {
		const totalOrders = await Order.countDocuments();
		const totalRevenue = await Order.aggregate([
			{ $group: { _id: null, total: { $sum: '$total' } } }
		]);
		
		res.json({
			totalOrders,
			totalRevenue: totalRevenue[0]?.total || 0
		});
	} catch (error) {
		console.error('Error fetching order stats:', error);
		res.status(500).json({ message: 'Failed to fetch order statistics' });
	}
});

// Get booking statistics
router.get('/stats/bookings', protect, async (req, res) => {
	try {
		const totalBookings = await Booking.countDocuments();
		const totalRevenue = await Booking.aggregate([
			{ $group: { _id: null, total: { $sum: '$totalFare' } } }
		]);
		const totalDistance = await Booking.aggregate([
			{ $group: { _id: null, total: { $sum: '$distance' } } }
		]);
		
		res.json({
			totalBookings,
			totalRevenue: totalRevenue[0]?.total || 0,
			totalDistance: totalDistance[0]?.total || 0
		});
	} catch (error) {
		console.error('Error fetching booking stats:', error);
		res.status(500).json({ message: 'Failed to fetch booking statistics' });
	}
});

export default router;
