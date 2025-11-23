import express from "express";
import { register, login, forgotPassword } from "../controllers/authController.js";
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateForgotPassword 
} from "../middleware/validateInput.js";

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);

export default router;
