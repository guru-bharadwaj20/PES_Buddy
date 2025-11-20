import mongoose from "mongoose";
const { Schema } = mongoose;

const menuItemSchema = new Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	canteen: { type: Schema.Types.ObjectId, ref: "Canteen", required: true },
	description: { type: String },
	available: { type: Boolean, default: true }
}, { timestamps: true });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
