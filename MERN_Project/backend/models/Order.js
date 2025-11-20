import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema({
	menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem" },
	name: { type: String },
	price: { type: Number },
	quantity: { type: Number, default: 1 }, // Changed from qty to quantity for consistency
	canteen: { type: Schema.Types.ObjectId, ref: "Canteen" } // Added canteen reference
});

const orderSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	canteenName: { type: String },
	items: [orderItemSchema],
	totalAmount: { type: Number, required: true }, // Added totalAmount alias
	total: { type: Number, required: true },
	status: { type: String, enum: ["placed", "preparing", "completed", "cancelled", "pending"], default: "placed" }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
