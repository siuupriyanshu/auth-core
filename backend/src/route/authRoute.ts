import express from 'express';
import { login, register, verifyEmail } from '../controller/authController';
import { validate } from '../validate/validate';
import { loginSchema, registerSchema, verifyEmailSchema } from '../validate/schema';

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);

export default router;
