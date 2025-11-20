import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import socketService from '../services/socketService';

const Dashboard = () => {
	const { user, socketConnected } = useContext(AuthContext);
	const [connectedUsers, setConnectedUsers] = useState(0);
	const [recentActivity, setRecentActivity] = useState([]);

	useEffect(() => {
		// Listen to user count updates
		socketService.onUserCountUpdate((count) => {
			setConnectedUsers(count);
		});

		// Listen to new orders
		socketService.onNewOrder((data) => {
			setRecentActivity(prev => [...prev, {
				type: 'order',
				message: `${data.userName} placed an order at ${data.canteenName}`,
				time: new Date(data.timestamp).toLocaleTimeString()
			}].slice(-5)); // Keep last 5 activities
		});

		// Listen to scooter bookings
		socketService.onScooterBooked((data) => {
			setRecentActivity(prev => [...prev, {
				type: 'scooter',
				message: `${data.bookedBy} booked scooter ${data.scooterId}`,
				time: new Date(data.timestamp).toLocaleTimeString()
			}].slice(-5));
		});

		return () => {
			socketService.removeListener('users:count');
			socketService.removeListener('order:new');
			socketService.removeListener('scooter:booked');
		};
	}, []);

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="mb-8">
				<h2 className="text-4xl font-bold text-white mb-3">Dashboard</h2>
				<p className="text-xl text-gray-300">Welcome to PES Buddy{user ? `, ${user.name}` : ''}! Use the nav to access Doormato, Scootigo and Expense Tracker.</p>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="glass rounded-2xl p-6 card-hover">
					<h3 className="text-2xl font-bold text-white mb-4">Connection Status</h3>
					<div className="flex items-center gap-3 mb-3">
						<div className={`w-4 h-4 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
						<span className="text-white font-bold text-lg">
							{socketConnected ? '✅ Real-time Connected' : '❌ Disconnected'}
						</span>
					</div>
					{connectedUsers > 0 && (
						<div className="text-gray-400">
							👥 {connectedUsers} user{connectedUsers !== 1 ? 's' : ''} online
						</div>
					)}
				</div>
				
				<div className="glass rounded-2xl p-6 card-hover">
					<h3 className="text-2xl font-bold text-white mb-4">Quick Stats</h3>
					<div className="space-y-2">
						<p className="text-gray-300">🍔 Doormato - Order food from canteens</p>
						<p className="text-gray-300">🛵 Scootigo - Book campus scooters</p>
						<p className="text-gray-300">💰 Expense Tracker - Track your spending</p>
					</div>
				</div>
			</div>

			{recentActivity.length > 0 && (
				<div className="glass rounded-2xl p-6">
					<h3 className="text-2xl font-bold text-white mb-4">Recent Activity</h3>
					<ul className="space-y-2">
						{recentActivity.map((activity, idx) => (
							<li key={idx} className="text-gray-300">
								<span className="text-light-blue">[{activity.time}]</span> {activity.message}
							</li>
						))}
					</ul>
				</div>
			)}
		</main>
	);
};

export default Dashboard;
