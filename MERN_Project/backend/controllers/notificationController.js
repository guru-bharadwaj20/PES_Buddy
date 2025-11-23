import Notification from '../models/Notification.js';
import { handleError, notFoundError } from '../utils/errorHandler.js';

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
		return handleError(res, err);
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
		return handleError(res, err);
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
			return notFoundError(res, 'Notification not found');
		}
		
		res.json(notification);
	} catch (err) {
		return handleError(res, err);
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
		return handleError(res, err);
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
			return notFoundError(res, 'Notification not found');
		}
		
		res.json({ message: 'Notification deleted' });
	} catch (err) {
		return handleError(res, err);
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
