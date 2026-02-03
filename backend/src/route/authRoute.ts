import express from 'express';
import { login, me, register, verifyEmail, resetPassword, forgotPassword } from '../controller/authController';
import { validate } from '../validate/validate';
import { loginSchema, registerSchema, verifyEmailSchema, resetPasswordSchema, forgotPasswordSchema } from '../validate/schema';

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.get("/me", me);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

export default router;
