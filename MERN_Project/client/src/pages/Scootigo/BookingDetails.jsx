import React from 'react';
import { useLocation } from 'react-router-dom';

const BookingDetails = () => {
	const { state } = useLocation();
	const booking = state?.booking;

	if (!booking) return <main className="container"><div className="card muted">No booking details available.</div></main>;

	return (
		<main className="container">
			<h2 className="page-title">Booking Details</h2>
			<div className="card">
				<div><strong>Scooter:</strong> {booking.scooterId}</div>
				<div><strong>Driver:</strong> {booking.driverName}</div>
				<div><strong>Fare:</strong> <span className="item-price">₹{booking.fare}</span></div>
				<div><strong>Pickup:</strong> {booking.pickup}</div>
				<div><strong>Destination:</strong> {booking.destination}</div>
			</div>
		</main>
	);
};

export default BookingDetails;
