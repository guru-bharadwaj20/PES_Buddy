import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const protect = async (req, res, next) => {
	let token = null;

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies && req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		return res.status(401).json({ message: "Not authorized, token missing" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password");
		if (!user) return res.status(401).json({ message: "User not found" });
		req.user = user;
		next();
	} catch (err) {
		console.error(err);
		return res.status(401).json({ message: "Not authorized, token invalid" });
	}
};
