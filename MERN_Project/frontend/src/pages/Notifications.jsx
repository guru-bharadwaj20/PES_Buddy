import React, { useState, useEffect, useContext } from 'react';
import notificationService from '../services/notificationService';
import socketService from '../services/socketService';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, unread
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) {
			fetchNotifications();
			
			// Listen for new notifications via WebSocket
			socketService.onNotification((data) => {
				console.log('🔔 New notification received:', data);
				fetchNotifications();
			});
		}
		
		return () => {
			socketService.removeListener('notification:new');
		};
	}, [user]);

	const fetchNotifications = async () => {
		try {
			setLoading(true);
			const data = await notificationService.getNotifications();
			setNotifications(data);
		} catch (error) {
			console.error('Failed to fetch notifications:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsRead = async (notificationId) => {
		try {
			await notificationService.markAsRead(notificationId);
			setNotifications(notifications.map(n => 
				n._id === notificationId ? { ...n, read: true } : n
			));
		} catch (error) {
			console.error('Failed to mark as read:', error);
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await notificationService.markAllAsRead();
			setNotifications(notifications.map(n => ({ ...n, read: true })));
		} catch (error) {
			console.error('Failed to mark all as read:', error);
		}
	};

	const handleDelete = async (notificationId) => {
		try {
			await notificationService.deleteNotification(notificationId);
			setNotifications(notifications.filter(n => n._id !== notificationId));
		} catch (error) {
			console.error('Failed to delete notification:', error);
		}
	};

	const filteredNotifications = notifications.filter(n => {
		if (filter === 'unread') return !n.read;
		return true;
	});

	const unreadCount = notifications.filter(n => !n.read).length;

	const getTypeColor = (type) => {
		switch(type) {
			case 'order': return 'border-blue-500 bg-blue-500/10';
			case 'booking': return 'border-purple-500 bg-purple-500/10';
			case 'expense': return 'border-green-500 bg-green-500/10';
			case 'system': return 'border-gray-500 bg-gray-500/10';
			default: return 'border-gray-500 bg-gray-500/10';
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
	};

	return (
		<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-5xl font-bold text-white mb-4">🔔 Notifications</h1>
				<p className="text-xl text-gray-300">Stay updated with your activities</p>
			</div>

			{/* Actions Bar */}
			<div className="flex flex-wrap items-center justify-between gap-4 mb-8">
				{/* Filter Tabs */}
				<div className="flex space-x-2">
					<button
						onClick={() => setFilter('all')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'all'
								? 'bg-light-blue text-white'
								: 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
						}`}
					>
						All ({notifications.length})
					</button>
					<button
						onClick={() => setFilter('unread')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'unread'
								? 'bg-light-blue text-white'
								: 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
						}`}
					>
						Unread ({unreadCount})
					</button>
				</div>

				{/* Mark All Read Button */}
				{unreadCount > 0 && (
					<button
						onClick={handleMarkAllAsRead}
						className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all"
					>
						✓ Mark All Read
					</button>
				)}
			</div>

			{/* Notifications List */}
			{loading ? (
				<div className="flex items-center justify-center py-20">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-light-blue"></div>
				</div>
			) : filteredNotifications.length === 0 ? (
				<div className="glass rounded-2xl p-12 text-center">
					<div className="text-6xl mb-4">📭</div>
					<h3 className="text-2xl font-bold text-white mb-2">No Notifications</h3>
					<p className="text-gray-400">
						{filter === 'unread' 
							? "You're all caught up! No unread notifications." 
							: "You don't have any notifications yet."}
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredNotifications.map((notification) => (
						<div
							key={notification._id}
							className={`glass rounded-2xl p-6 border-2 transition-all ${
								!notification.read 
									? 'border-light-blue/50 bg-light-blue/5' 
									: 'border-transparent hover:border-gray-700/50'
							}`}
						>
						<div className="flex items-start space-x-4">
							{/* Icon */}
							<div className={`shrink-0 w-12 h-12 rounded-full ${getTypeColor(notification.type)} border-2 flex items-center justify-center text-2xl`}>
								{notification.icon}
							</div>								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-4 mb-2">
										<h3 className="text-lg font-bold text-white">
											{notification.title}
										</h3>
										<span className="text-sm text-gray-500 whitespace-nowrap">
											{formatDate(notification.createdAt)}
										</span>
									</div>
									<p className="text-gray-300 mb-3">{notification.message}</p>
									
									{/* Type Badge */}
									<div className="flex items-center space-x-2">
										<span className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs font-semibold rounded-lg uppercase">
											{notification.type}
										</span>
										{!notification.read && (
											<span className="px-3 py-1 bg-light-blue/20 text-light-blue text-xs font-bold rounded-lg">
												NEW
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-col space-y-2">
									{!notification.read && (
										<button
											onClick={() => handleMarkAsRead(notification._id)}
											className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-all"
											title="Mark as read"
										>
											✓
										</button>
									)}
									<button
										onClick={() => handleDelete(notification._id)}
										className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-all"
										title="Delete"
									>
										🗑
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</main>
	);
};

export default Notifications;
