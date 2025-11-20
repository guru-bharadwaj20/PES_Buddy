import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	scooter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Scooter',
		required: true
	},
	driver: {
		type: String,
		required: true
	},
	vehicleNumber: {
		type: String
	},
	pickup: {
		type: String,
		required: true
	},
	destination: {
		type: String,
		required: true
	},
	distance: {
		type: Number,
		required: true
	},
	farePerKm: {
		type: Number,
		required: true
	},
	totalFare: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		enum: ['pending', 'ongoing', 'completed', 'cancelled'],
		default: 'pending'
	}
}, {
	timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
