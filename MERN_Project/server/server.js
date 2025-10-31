import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doormatoRoutes from "./routes/doormatoRoutes.js";
import scootigoRoutes from "./routes/scootigoRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/doormato", doormatoRoutes);
app.use("/api/scootigo", scootigoRoutes);
app.use("/api/expense", expenseRoutes);

// health
app.get("/", (req, res) => res.json({ ok: true, message: "PES Buddy API" }));

// start
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
