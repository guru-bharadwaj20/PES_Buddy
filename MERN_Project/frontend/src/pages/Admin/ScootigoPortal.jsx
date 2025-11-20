import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import scootigoService from '../../services/scootigoService';

const ScootigoPortal = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			// Fetch all bookings from the backend
			const response = await scootigoService.getAllBookings();
			setBookings(response);
		} catch (error) {
			console.error('Failed to fetch bookings:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredBookings = bookings.filter(booking => {
		const matchesSearch = booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 booking.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 booking.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 booking.destination?.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	const getTotalRevenue = () => {
		return bookings.reduce((sum, booking) => sum + (booking.totalFare || 0), 0);
	};

	const getTotalDistance = () => {
		return bookings.reduce((sum, booking) => sum + (booking.distance || 0), 0);
	};

	const getTopDrivers = () => {
		const driverStats = {};
		bookings.forEach(booking => {
			const driver = booking.driver || 'Unknown';
			if (!driverStats[driver]) {
				driverStats[driver] = { trips: 0, revenue: 0 };
			}
			driverStats[driver].trips += 1;
			driverStats[driver].revenue += booking.totalFare || 0;
		});
		return Object.entries(driverStats)
			.sort((a, b) => b[1].trips - a[1].trips)
			.slice(0, 4);
	};

	const topDrivers = getTopDrivers();

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-8">
				<Link to="/admin" className="text-light-blue hover:text-blue-400 mb-4 flex items-center space-x-2 w-fit">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					<span>Back to Admin Portal</span>
				</Link>
				<h1 className="text-5xl font-bold text-white mb-4">🛵 Scootigo Bookings</h1>
				<p className="text-xl text-gray-300">Manage and monitor all ride bookings</p>
			</div>

			{/* Stats Cards */}
			<div className="grid md:grid-cols-4 gap-6 mb-8">
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Total Rides</p>
						<div className="text-3xl">🚗</div>
					</div>
					<p className="text-3xl font-bold text-white">{bookings.length}</p>
				</div>
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Total Revenue</p>
						<div className="text-3xl">💰</div>
					</div>
					<p className="text-3xl font-bold text-green-500">₹{getTotalRevenue().toFixed(2)}</p>
				</div>
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Total Distance</p>
						<div className="text-3xl">📍</div>
					</div>
					<p className="text-3xl font-bold text-light-blue">{getTotalDistance().toFixed(1)} km</p>
				</div>
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Avg Fare</p>
						<div className="text-3xl">💵</div>
					</div>
					<p className="text-3xl font-bold text-yellow-500">
						₹{bookings.length > 0 ? (getTotalRevenue() / bookings.length).toFixed(2) : '0.00'}
					</p>
				</div>
			</div>

			{/* Top Drivers */}
			<div className="glass rounded-2xl p-8 mb-8">
				<h2 className="text-2xl font-bold text-white mb-6">Top Drivers</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{topDrivers.map(([driver, stats], idx) => (
						<div key={driver} className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700 relative overflow-hidden">
							<div className="absolute top-2 right-2 w-10 h-10 bg-light-blue/20 rounded-full flex items-center justify-center">
								<span className="text-light-blue font-bold">#{idx + 1}</span>
							</div>
							<div className="text-4xl mb-3">👨‍✈️</div>
							<h3 className="text-white font-bold text-lg mb-3">{driver}</h3>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">Trips</span>
									<span className="text-white font-semibold">{stats.trips}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">Revenue</span>
									<span className="text-green-500 font-semibold">₹{stats.revenue.toFixed(2)}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Search and Filter */}
			<div className="glass rounded-2xl p-6 mb-8">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
					<div className="relative grow max-w-md">
						<input
							type="text"
							placeholder="Search by user, driver, or location..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
						/>
						<svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<button
						onClick={fetchBookings}
						className="px-6 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg"
					>
						Refresh Data
					</button>
				</div>
			</div>

			{/* Bookings Table */}
			<div className="glass rounded-2xl p-8">
				<h2 className="text-2xl font-bold text-white mb-6">All Bookings</h2>
				
				{loading ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">⏳</div>
						<p className="text-xl text-gray-400">Loading bookings...</p>
					</div>
				) : filteredBookings.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">🚫</div>
						<p className="text-xl text-gray-400">No bookings found</p>
						<p className="text-gray-500 mt-2">Bookings will appear here once customers start booking rides</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-700">
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Booking ID</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Customer</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Driver</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Route</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Date & Time</th>
									<th className="text-center py-4 px-4 text-gray-400 font-semibold">Distance</th>
									<th className="text-right py-4 px-4 text-gray-400 font-semibold">Fare</th>
								</tr>
							</thead>
							<tbody>
								{filteredBookings.slice().reverse().map((booking) => {
									const date = new Date(booking.createdAt || booking.date);
									
									return (
										<tr key={booking._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-all">
											<td className="py-4 px-4">
												<span className="text-light-blue font-mono text-sm">#{booking._id?.slice(-8)}</span>
											</td>
											<td className="py-4 px-4">
												<div>
													<p className="text-white font-semibold">{booking.user?.name || 'Guest'}</p>
													<p className="text-gray-500 text-sm">{booking.user?.srn || 'N/A'}</p>
												</div>
											</td>
											<td className="py-4 px-4">
												<div>
													<p className="text-white font-semibold">{booking.driver}</p>
													<p className="text-gray-500 text-sm">🛵 {booking.vehicleNumber || 'N/A'}</p>
												</div>
											</td>
											<td className="py-4 px-4">
												<div>
													<p className="text-white font-semibold flex items-center">
														<span className="text-green-500 mr-2">📍</span>
														{booking.pickup}
													</p>
													<p className="text-gray-500 text-sm flex items-center mt-1">
														<span className="text-red-500 mr-2">📍</span>
														{booking.destination}
													</p>
												</div>
											</td>
											<td className="py-4 px-4">
												<div>
													<p className="text-white font-semibold">{date.toLocaleDateString()}</p>
													<p className="text-gray-500 text-sm">{date.toLocaleTimeString()}</p>
												</div>
											</td>
											<td className="py-4 px-4 text-center">
												<span className="text-light-blue font-bold">{booking.distance?.toFixed(1)} km</span>
											</td>
											<td className="py-4 px-4 text-right">
												<span className="text-2xl font-bold text-green-500">₹{(booking.totalFare || 0).toFixed(2)}</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</main>
	);
};

export default ScootigoPortal;
