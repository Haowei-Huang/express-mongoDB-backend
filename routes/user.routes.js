import express from 'express';
const router = express.Router();
import { login, register, findUserByEmail, refreshAccessToken, logout, findAllUsers, findUserById, updateUser, deleteUser } from '../controllers/user.controller.js';

router.post('/login', login);

router.post('/logout', logout);

router.post('/refreshAccessToken', refreshAccessToken);

router.post('/register', register); // Assuming register uses the same controller as login

router.get('/findUserByEmail/:userEmail', findUserByEmail);

router.get('/findAllUsers', findAllUsers);

router.get('/findUserById/:userId', findUserById);

router.put('/updateUser/:userId', updateUser);

router.delete('/deleteUser/:userId', deleteUser);

export default router;