import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
	try {
		const { name, srn, password, email, role } = req.body;
		if (!name || !srn || !password) return res.status(400).json({ message: "Name, SRN and password required" });
		const exists = await User.findOne({ srn });
		if (exists) return res.status(400).json({ message: "User with this SRN already exists" });
		const user = await User.create({ name, srn, password, email, role: role || 'customer' });
		const token = generateToken(user._id);
		res.status(201).json({ user: { id: user._id, name: user.name, srn: user.srn, email: user.email, role: user.role }, token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { srn, password, isAdmin } = req.body;
		if (!srn || !password) return res.status(400).json({ message: "SRN and password required" });
		const user = await User.findOne({ srn });
		if (!user) return res.status(401).json({ message: "Invalid credentials" });
		
		// Check if admin login is requested and user has admin role
		if (isAdmin && user.role !== 'admin') {
			return res.status(403).json({ message: "Access denied. Admin privileges required." });
		}
		
		// Check if customer login but user is admin (should use admin portal)
		if (!isAdmin && user.role === 'admin') {
			return res.status(403).json({ message: "Please use admin portal to login." });
		}
		
		const isMatch = await user.comparePassword(password);
		if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
		const token = generateToken(user._id);
		res.json({ user: { id: user._id, name: user.name, srn: user.srn, email: user.email, role: user.role }, token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: "Email required" });
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "No user found with this email" });
		
		// In a real application, you would:
		// 1. Generate a unique reset token
		// 2. Save it to the database with an expiry time
		// 3. Send an email with a reset link containing the token
		// For now, we'll just return a success message
		console.log(`Password reset requested for: ${email}`);
		res.json({ message: "Password reset instructions sent to your email" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { name, email } = req.body;
		const userId = req.user.id;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Update fields
		if (name) user.name = name;
		if (email) user.email = email;

		await user.save();

		res.json({ 
			message: "Profile updated successfully",
			user: { 
				id: user._id, 
				name: user.name, 
				srn: user.srn, 
				email: user.email, 
				role: user.role 
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const userId = req.user.id;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({ message: "Current password and new password are required" });
		}

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Verify current password
		const isMatch = await user.comparePassword(currentPassword);
		if (!isMatch) {
			return res.status(401).json({ message: "Current password is incorrect" });
		}

		// Update password
		user.password = newPassword;
		await user.save();

		res.json({ message: "Password reset successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const deleteAccount = async (req, res) => {
	try {
		const userId = req.user.id;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Delete user account
		await User.findByIdAndDelete(userId);

		// TODO: Also delete related data (orders, bookings, expenses, etc.)
		// You might want to add cascade deletion for related collections

		res.json({ message: "Account deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

