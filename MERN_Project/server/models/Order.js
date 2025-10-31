import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema({
	menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem" },
	name: { type: String },
	price: { type: Number },
	qty: { type: Number, default: 1 }
});

const orderSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	canteenName: { type: String },
	items: [orderItemSchema],
	total: { type: Number, required: true },
	status: { type: String, enum: ["placed", "preparing", "completed", "cancelled"], default: "placed" }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
