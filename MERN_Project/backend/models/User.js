import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema({
	name: { type: String, required: true },
	srn: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (err) {
		return next(err);
	}
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
