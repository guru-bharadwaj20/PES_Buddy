import Scooter from "../models/Scooter.js";
import Booking from "../models/Booking.js";

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

		const totalDistance = (distance && Number(distance)) ? Number(distance) : 1.0;
		const totalFare = totalDistance * scooter.farePerKm;

		// Create booking in database
		const booking = await Booking.create({
			user: user._id,
			scooter: scooter._id,
			driver: scooter.driverName,
			vehicleNumber: scooter.vehicleNumber || 'N/A',
			pickup: pickup || "",
			destination: destination || "",
			distance: totalDistance,
			farePerKm: scooter.farePerKm,
			totalFare: totalFare,
			status: 'pending'
		});

		// Emit real-time scooter availability update
		const io = req.app.get("io");
		if (io) {
			io.emit("scooter:booked", {
				scooterId: scooter.scooterId,
				available: false,
				bookedBy: user.name,
				timestamp: new Date()
			});
		}

		res.status(200).json({ message: "Scooter booked", booking });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

