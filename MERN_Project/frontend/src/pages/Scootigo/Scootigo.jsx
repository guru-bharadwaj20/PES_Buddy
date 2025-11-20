import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import scootigoService from '../../services/scootigoService';
import socketService from '../../services/socketService';
import { AuthContext } from '../../context/AuthContext';

const Scootigo = () => {
	const [step, setStep] = useState(1); // 1: Select Route, 2: View Drivers
	const [pickup, setPickup] = useState('');
	const [destination, setDestination] = useState('');
	const [scooters, setScooters] = useState([]);
	const [filteredScooters, setFilteredScooters] = useState([]);
	const [selectedScooter, setSelectedScooter] = useState(null);
	const [bookingMsg, setBookingMsg] = useState('');
	const [loading, setLoading] = useState(false);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	// Campus locations
	const locations = [
		'GJBC Block',
		'SKM Block',
		'BE Block',
		'MRD Block',
		'F Block',
		'OAT (Open Air Theatre)',
		'Library',
		'Admin Block',
		'Hostel Area',
		'Main Gate'
	];

	// Routes and their distances
	const routes = {
		'GJBC Block-OAT (Open Air Theatre)': 2,
		'OAT (Open Air Theatre)-GJBC Block': 2,
		'SKM Block-BE Block': 3,
		'BE Block-SKM Block': 3,
		'MRD Block-F Block': 2,
		'F Block-MRD Block': 2,
		'Main Gate-Admin Block': 1.5,
		'Library-Hostel Area': 2.5
	};

	const fetchScooters = async () => {
		try {
			const data = await scootigoService.getScooters();
			setScooters(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchScooters();

		// Listen to real-time scooter updates
		socketService.onScooterBooked((data) => {
			setScooters(prev => prev.map(s => 
				s.scooterId === data.scooterId 
					? { ...s, available: data.available }
					: s
			));
			setFilteredScooters(prev => prev.map(s => 
				s.scooterId === data.scooterId 
					? { ...s, available: data.available }
					: s
			));
			if (data.bookedBy !== user?.name) {
				setBookingMsg(`${data.scooterId} was just booked by ${data.bookedBy}`);
				setTimeout(() => setBookingMsg(''), 5000);
			}
		});

		socketService.onScooterAvailability((data) => {
			setScooters(prev => prev.map(s => 
				s.scooterId === data.scooterId 
					? { ...s, available: data.available }
					: s
			));
			setFilteredScooters(prev => prev.map(s => 
				s.scooterId === data.scooterId 
					? { ...s, available: data.available }
					: s
			));
		});

		return () => {
			socketService.removeListener('scooter:booked');
			socketService.removeListener('scooter:availability');
		};
	}, [user]);

	const handleSearchRide = () => {
		if (!pickup || !destination) {
			setBookingMsg('Please select both pickup and destination');
			setTimeout(() => setBookingMsg(''), 3000);
			return;
		}
		if (pickup === destination) {
			setBookingMsg('Pickup and destination cannot be the same');
			setTimeout(() => setBookingMsg(''), 3000);
			return;
		}

		// Filter available scooters for this route
		const routeKey = `${pickup}-${destination}`;
		const availableScooters = scooters.filter(s => s.available && s.route.includes(pickup) && s.route.includes(destination));
		
		if (availableScooters.length === 0) {
			setFilteredScooters(scooters.filter(s => s.available));
		} else {
			setFilteredScooters(availableScooters);
		}
		
		setStep(2);
	};

	const handleSelectScooter = (scooter) => {
		setSelectedScooter(scooter);
	};

	const handleConfirmBooking = async () => {
		if (!user) {
			setBookingMsg('Please login to book');
			setTimeout(() => setBookingMsg(''), 3000);
			return;
		}
		if (!selectedScooter) return;

		setLoading(true);
		try {
			const routeKey = `${pickup}-${destination}`;
			const distance = routes[routeKey] || 2;
			const payload = { 
				scooterId: selectedScooter.scooterId, 
				distance,
				pickup,
				destination
			};
			const res = await scootigoService.book(payload);
			
			setBookingMsg(`🎉 Booking Confirmed! Fare: ₹${res.booking.fare}`);
			setScooters(prev => prev.map(s => 
				s.scooterId === selectedScooter.scooterId 
					? { ...s, available: false }
					: s
			));
			
			setTimeout(() => {
				navigate('/dashboard');
			}, 2000);
		} catch (err) {
			setBookingMsg(err.response?.data?.message || 'Booking failed');
			setTimeout(() => setBookingMsg(''), 5000);
		} finally {
			setLoading(false);
		}
	};

	const calculateFare = (scooter) => {
		const routeKey = `${pickup}-${destination}`;
		const distance = routes[routeKey] || 2;
		return Math.round(scooter.farePerKm * distance);
	};

	const getEstimatedTime = () => {
		const routeKey = `${pickup}-${destination}`;
		const distance = routes[routeKey] || 2;
		return Math.round(distance * 3); // Assuming 3 min per km
	};

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="mb-10">
				<h2 className="text-5xl font-bold text-white mb-4">🛵 Scootigo</h2>
				<p className="text-xl text-gray-300">Book scooters in real-time. Availability updates instantly!</p>
			</div>

			{/* Notification Message */}
			{bookingMsg && (
				<div className={`mb-6 p-4 rounded-xl ${
					bookingMsg.includes('✅') || bookingMsg.includes('🎉') 
						? 'bg-green-500/20 border border-green-500/30 text-green-400' 
						: 'bg-light-blue/20 border border-light-blue/30 text-light-blue'
				}`}>
					{bookingMsg}
				</div>
			)}

			{/* Step 1: Route Selection */}
			{step === 1 && (
				<div className="glass rounded-2xl p-10">
					<h3 className="text-3xl font-bold text-white mb-8">Where would you like to go?</h3>
					
					<div className="space-y-8">
						{/* Pickup Location */}
						<div>
							<label className="block text-white font-semibold mb-3">Pickup Location</label>
							<div className="relative">
								<div className="absolute left-4 top-1/2 transform -translate-y-1/2">
									<div className="w-3 h-3 bg-light-blue rounded-full"></div>
								</div>
								<select
									value={pickup}
									onChange={(e) => setPickup(e.target.value)}
									className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none text-lg"
								>
									<option value="">Select pickup point</option>
									{locations.map(loc => (
										<option key={loc} value={loc}>{loc}</option>
									))}
								</select>
							</div>
						</div>

						{/* Swap Button */}
						<div className="flex justify-center">
							<button
								onClick={() => {
									const temp = pickup;
									setPickup(destination);
									setDestination(temp);
								}}
								className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-all"
							>
								<svg className="w-6 h-6 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
								</svg>
							</button>
						</div>

						{/* Destination */}
						<div>
							<label className="block text-white font-semibold mb-3">Destination</label>
							<div className="relative">
								<div className="absolute left-4 top-1/2 transform -translate-y-1/2">
									<div className="w-3 h-3 bg-light-red rounded-full"></div>
								</div>
								<select
									value={destination}
									onChange={(e) => setDestination(e.target.value)}
									className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none text-lg"
								>
									<option value="">Select destination</option>
									{locations.map(loc => (
										<option key={loc} value={loc}>{loc}</option>
									))}
								</select>
							</div>
						</div>

						{/* Search Button */}
						<button
							onClick={handleSearchRide}
							disabled={!pickup || !destination}
							className="w-full py-4 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
						>
							Search Available Rides
						</button>
					</div>
				</div>
			)}

			{/* Step 2: Driver Selection */}
			{step === 2 && (
				<div>
					{/* Trip Summary */}
					<div className="glass rounded-2xl p-6 mb-6">
						<button
							onClick={() => setStep(1)}
							className="text-light-blue hover:text-blue-400 mb-4 flex items-center space-x-2"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							<span>Change Route</span>
						</button>
						
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="flex flex-col items-center">
									<div className="w-4 h-4 bg-light-blue rounded-full"></div>
									<div className="w-0.5 h-8 bg-gray-600"></div>
									<div className="w-4 h-4 bg-light-red rounded-full"></div>
								</div>
								<div>
									<div className="text-white font-semibold text-lg">{pickup}</div>
									<div className="text-gray-400 text-sm my-2">~{getEstimatedTime()} min ride</div>
									<div className="text-white font-semibold text-lg">{destination}</div>
								</div>
							</div>
						</div>
					</div>

					{/* Available Drivers */}
					<h3 className="text-3xl font-bold text-white mb-8">Available Drivers</h3>
					
					{filteredScooters.length === 0 ? (
						<div className="glass rounded-2xl p-12 text-center">
							<div className="text-6xl mb-4">🛵</div>
							<h3 className="text-2xl font-bold text-white mb-2">No drivers available</h3>
							<p className="text-gray-400 mb-6">Try a different route or check back later</p>
							<button
								onClick={() => setStep(1)}
								className="px-8 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
							>
								Select Different Route
							</button>
						</div>
					) : (
						<div className="space-y-6 mb-32">
							{filteredScooters.map(scooter => (
								<div
									key={scooter._id}
									onClick={() => scooter.available && handleSelectScooter(scooter)}
									className={`glass rounded-2xl p-8 transition-all cursor-pointer ${
										selectedScooter?._id === scooter._id
											? 'border-2 border-light-blue shadow-lg shadow-light-blue/30'
											: 'border-2 border-transparent hover:border-gray-700'
									} ${!scooter.available ? 'opacity-50 cursor-not-allowed' : ''}`}
								>
									<div className="flex items-start justify-between">
										{/* Driver Info */}
										<div className="flex items-start space-x-6 grow">
											{/* Driver Avatar */}
											<div className="w-20 h-20 shrink-0 rounded-full bg-linear-to-br from-light-blue to-blue-600 flex items-center justify-center">
												<span className="text-white text-3xl">🛵</span>
											</div>
											
											<div className="grow">
												{/* Driver Name & Rating */}
												<div className="flex items-center space-x-3 mb-3">
													<h4 className="text-2xl font-bold text-white">{scooter.driverName}</h4>
													<div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
														<svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
															<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
														</svg>
														<span className="text-white font-semibold">4.8</span>
													</div>
												</div>

												{/* Driver Details - Bullet Points */}
												<div className="space-y-2 text-gray-300">
													<div className="flex items-center space-x-2">
														<span className="text-light-blue">•</span>
														<span><strong className="text-white">Scooter ID:</strong> {scooter.scooterId}</span>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-light-blue">•</span>
														<span><strong className="text-white">Vehicle Number:</strong> {scooter.vehicleNumber}</span>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-light-blue">•</span>
														<span><strong className="text-white">Rate:</strong> ₹{scooter.farePerKm}/km</span>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-light-blue">•</span>
														<span><strong className="text-white">Estimated Time:</strong> {getEstimatedTime()} minutes</span>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-light-blue">•</span>
														<span className="flex items-center space-x-2">
															<strong className="text-white">Status:</strong>
															<div className={`w-2 h-2 rounded-full ${scooter.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
															<span className={scooter.available ? 'text-green-400' : 'text-red-400'}>
																{scooter.available ? 'Available Now' : 'Busy'}
															</span>
														</span>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-light-blue">•</span>
														<span><strong className="text-white">Total Trips:</strong> 487</span>
													</div>
												</div>
											</div>
										</div>

										{/* Fare */}
										<div className="text-right shrink-0 ml-6">
											<div className="text-4xl font-bold text-white">₹{calculateFare(scooter)}</div>
											<p className="text-gray-400 text-sm mt-1">Total Fare</p>
										</div>
									</div>

									{/* Selected Driver Summary */}
									{selectedScooter?._id === scooter._id && (
										<div className="mt-6 pt-6 border-t border-gray-700">
											<div className="flex items-center justify-between text-lg">
												<div className="space-y-2">
													<div className="flex items-center space-x-3">
														<span className="text-gray-400">Distance:</span>
														<span className="text-white font-bold text-xl">
															{routes[`${pickup}-${destination}`] || 2} km
														</span>
													</div>
													<div className="flex items-center space-x-3">
														<span className="text-gray-400">Total Cost:</span>
														<span className="text-white font-bold text-2xl">₹{calculateFare(scooter)}</span>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Pay Now Button */}
					{selectedScooter && (
						<div className="fixed bottom-8 left-0 right-0 px-4 max-w-7xl mx-auto">
							<div className="glass rounded-2xl p-6 shadow-2xl">
								<div className="flex items-center justify-between mb-4">
									<div>
										<p className="text-gray-400 text-sm mb-1">Total Distance</p>
										<p className="text-white text-2xl font-bold">{routes[`${pickup}-${destination}`] || 2} km</p>
									</div>
									<div>
										<p className="text-gray-400 text-sm mb-1">Total Amount</p>
										<p className="text-white text-3xl font-bold">₹{calculateFare(selectedScooter)}</p>
									</div>
								</div>
								<button
									onClick={handleConfirmBooking}
									disabled={loading}
									className="w-full py-4 bg-light-red hover:bg-red-600 text-white font-bold rounded-xl transition-all border-2 border-light-red shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xl"
								>
									{loading ? 'Processing Payment...' : '💳 Pay Now'}
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</main>
	);
};

export default Scootigo;
