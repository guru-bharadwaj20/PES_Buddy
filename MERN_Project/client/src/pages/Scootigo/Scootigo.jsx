import React, { useEffect, useState, useContext } from 'react';
import scootigoService from '../../services/scootigoService';
import { AuthContext } from '../../context/AuthContext';

const Scootigo = () => {
	const [scooters, setScooters] = useState([]);
	const [bookingMsg, setBookingMsg] = useState('');
	const { user } = useContext(AuthContext);

	useEffect(() => {
		scootigoService.getScooters().then(setScooters).catch(err => console.error(err));
	}, []);

	const handleBook = async (scooter) => {
		if (!user) return setBookingMsg('Please login to book');
		try {
			const payload = { scooterId: scooter.scooterId, distance: 2 };
			const res = await scootigoService.book(payload);
			setBookingMsg(`Booked: Fare ₹${res.booking.fare}`);
		} catch (err) {
			setBookingMsg(err.response?.data?.message || 'Booking failed');
		}
	};

	return (
		<main className="container">
			<h2 className="page-title">Scootigo</h2>
			<div className="card card-grid">
						{scooters.map(s => (
							<div key={s._id} className="card p-sm">
						<div className="item-title">{s.scooterId}</div>
						<div className="muted">Driver: {s.driverName}</div>
						<div className="mt-1"><strong>Fare:</strong> <span className="item-price">₹{s.farePerKm}/km</span></div>
						<div className="mt-1">
							<button className={`btn ${s.available ? 'btn-accent' : 'btn-outline'}`} onClick={() => handleBook(s)} disabled={!s.available}>{s.available ? 'Book' : 'Busy'}</button>
						</div>
					</div>
				))}
			</div>
			{bookingMsg && <div className="mt-2">{bookingMsg}</div>}
		</main>
	);
};

export default Scootigo;
