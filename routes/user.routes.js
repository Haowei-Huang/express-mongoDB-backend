import express from 'express';
import { authenticationMiddleware } from '../controllers/user.controller.js';
const router = express.Router();
import { login, register, findUserByEmail, refreshAccessToken, logout, findAllUsers, findUserById, updateUser, deleteUser } from '../controllers/user.controller.js';

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refreshAccessToken', refreshAccessToken);

router.get('/findUserByEmail/:userEmail', findUserByEmail);

// needs authentication middleware
router.get('/findAllUsers', authenticationMiddleware, findAllUsers);

router.get('/findUserById/:userId', authenticationMiddleware, findUserById);

router.put('/updateUser/:userId', authenticationMiddleware, updateUser);

router.delete('/deleteUser/:userId', authenticationMiddleware, deleteUser);

export default router;