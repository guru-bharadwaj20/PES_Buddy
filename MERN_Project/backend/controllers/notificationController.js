import Notification from '../models/Notification.js';

// Get user's notifications
export const getUserNotifications = async (req, res) => {
	try {
		const user = req.user;
		const { limit = 50 } = req.query;
		
		const notifications = await Notification.find({ user: user._id })
			.sort({ createdAt: -1 })
			.limit(parseInt(limit))
			.lean();
			
		res.json(notifications);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

// Get unread count
export const getUnreadCount = async (req, res) => {
	try {
		const user = req.user;
		const count = await Notification.countDocuments({ 
			user: user._id, 
			read: false 
		});
		
		res.json({ count });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

// Mark notification as read
export const markAsRead = async (req, res) => {
	try {
		const user = req.user;
		const { notificationId } = req.params;
		
		const notification = await Notification.findOneAndUpdate(
			{ _id: notificationId, user: user._id },
			{ read: true },
			{ new: true }
		);
		
		if (!notification) {
			return res.status(404).json({ message: 'Notification not found' });
		}
		
		res.json(notification);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
	try {
		const user = req.user;
		
		await Notification.updateMany(
			{ user: user._id, read: false },
			{ read: true }
		);
		
		res.json({ message: 'All notifications marked as read' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

// Delete notification
export const deleteNotification = async (req, res) => {
	try {
		const user = req.user;
		const { notificationId } = req.params;
		
		const notification = await Notification.findOneAndDelete({
			_id: notificationId,
			user: user._id
		});
		
		if (!notification) {
			return res.status(404).json({ message: 'Notification not found' });
		}
		
		res.json({ message: 'Notification deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

// Helper function to create notification (used by other controllers)
export const createNotification = async (userId, type, title, message, relatedId = null, icon = '🔔') => {
	try {
		const notification = await Notification.create({
			user: userId,
			type,
			title,
			message,
			relatedId,
			icon
		});
		return notification;
	} catch (err) {
		console.error('Error creating notification:', err);
		return null;
	}
};
