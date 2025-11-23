import express from "express";
import { register, login, forgotPassword, updateProfile, resetPassword, deleteAccount } from "../controllers/authController.js";
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateForgotPassword,
  validateProfileUpdate,
  validatePasswordReset
} from "../middleware/validateInput.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.put("/profile", protect, validateProfileUpdate, updateProfile);
router.put("/reset-password", protect, validatePasswordReset, resetPassword);
router.delete("/account", protect, deleteAccount);

export default router;
