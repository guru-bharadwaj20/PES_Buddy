import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pes-buddy";

export const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("MongoDB connected");
	} catch (err) {
		console.error("MongoDB connection error:", err.message);
		process.exit(1);
	}
};
