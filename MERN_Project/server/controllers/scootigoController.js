import Scooter from "../models/Scooter.js";

export const getAvailableScooters = async (req, res) => {
	try {
		const scooters = await Scooter.find().lean();
		res.json(scooters);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const bookScooter = async (req, res) => {
	try {
		const user = req.user;
		const { scooterId, pickup, destination, distance } = req.body;
		if (!scooterId) return res.status(400).json({ message: "Scooter ID required" });

		const scooter = await Scooter.findOne({ scooterId });
		if (!scooter) return res.status(404).json({ message: "Scooter not found" });
		if (!scooter.available) return res.status(400).json({ message: "Scooter not available" });

		scooter.available = false;
		await scooter.save();

		const fare = (distance && Number(distance)) ? Number(distance) * scooter.farePerKm : scooter.farePerKm * 1.0;

		const booking = {
			scooterId: scooter.scooterId,
			driverName: scooter.driverName,
			fare,
			pickup: pickup || "",
			destination: destination || "",
			user: user._id
		};

		// For simplicity we don't persist bookings in separate model. Return booking details.
		res.status(200).json({ message: "Scooter booked", booking });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

