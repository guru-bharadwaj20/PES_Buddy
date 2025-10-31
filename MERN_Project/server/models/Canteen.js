import mongoose from "mongoose";

const canteenSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	location: { type: String },
	description: { type: String }
}, { timestamps: true });

const Canteen = mongoose.model("Canteen", canteenSchema);
export default Canteen;
