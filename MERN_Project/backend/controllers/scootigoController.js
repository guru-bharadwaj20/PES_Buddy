import Scooter from "../models/Scooter.js";
import Booking from "../models/Booking.js";
import { createNotification } from "./notificationController.js";
import { handleError, validationError, notFoundError } from "../utils/errorHandler.js";

export const getAvailableScooters = async (req, res) => {
	try {
		const scooters = await Scooter.find().lean();
		res.json(scooters);
	} catch (err) {
		return handleError(res, err);
	}
};

export const bookScooter = async (req, res) => {
	try {
		const user = req.user;
		const { scooterId, pickup, destination, distance } = req.body;
		if (!scooterId) return validationError(res, "Scooter ID required");

		const scooter = await Scooter.findOne({ scooterId });
		if (!scooter) return notFoundError(res, "Scooter not found");
		if (!scooter.available) return validationError(res, "Scooter not available");

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

		// Create notification for user
		await createNotification(
			user._id,
			'booking',
			'Scooter Booked',
			`Your ride with ${scooter.driverName} has been booked successfully. Total fare: ₹${totalFare.toFixed(2)}`,
			booking._id,
			'🛵'
		);

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
		return handleError(res, err);
	}
};

export const getUserBookings = async (req, res) => {
	try {
		const user = req.user;
		const bookings = await Booking.find({ user: user._id }).sort({ createdAt: -1 }).lean();
		res.json(bookings);
	} catch (err) {
		return handleError(res, err);
	}
};

