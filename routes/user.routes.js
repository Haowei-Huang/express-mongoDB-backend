import express from 'express';
const router = express.Router();
import { login, register, findUserByEmail } from '../controllers/user.controller.js';

router.post('/login', login);
router.post('/register', register); // Assuming register uses the same controller as login
router.get('/findUserByEmail/:userEmail', findUserByEmail);

export default router;