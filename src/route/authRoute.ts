import express from 'express';
import { login, register } from '../controller/authController';

const router = express.Router();

router.post("/login", login);
router.post("/sign-up", register);

export default router;
