import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
	try {
		const { name, srn, password, email } = req.body;
		if (!name || !srn || !password) return res.status(400).json({ message: "Name, SRN and password required" });
		const exists = await User.findOne({ srn });
		if (exists) return res.status(400).json({ message: "User with this SRN already exists" });
		const user = await User.create({ name, srn, password, email });
		const token = generateToken(user._id);
		res.status(201).json({ user: { id: user._id, name: user.name, srn: user.srn, email: user.email }, token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { srn, password } = req.body;
		if (!srn || !password) return res.status(400).json({ message: "SRN and password required" });
		const user = await User.findOne({ srn });
		if (!user) return res.status(401).json({ message: "Invalid credentials" });
		const isMatch = await user.comparePassword(password);
		if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
		const token = generateToken(user._id);
		res.json({ user: { id: user._id, name: user.name, srn: user.srn, email: user.email }, token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

