import mongoose from "mongoose";

const { Schema } = mongoose;

const scooterSchema = new Schema({
	scooterId: { type: String, required: true, unique: true },
	driverName: { type: String },
	vehicleNumber: { type: String },
	route: { type: String },
	farePerKm: { type: Number, required: true, default: 5 },
	available: { type: Boolean, default: true }
}, { timestamps: true });

const Scooter = mongoose.model("Scooter", scooterSchema);
export default Scooter;
