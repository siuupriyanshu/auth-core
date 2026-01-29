import express from 'express';
import { login, register } from '../controller/authController';
import { validate } from '../validate/validate';
import { loginSchema, registerSchema } from '../validate/schema';

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/sign-up", validate(registerSchema), register);

export default router;
