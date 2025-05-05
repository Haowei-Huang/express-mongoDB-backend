import express from 'express';
import { getUserBookedHotels, findAllHotels, findHotelById, updateHotel } from '../controllers/hotel.controller.js';
import { authenticationMiddleware } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/findAllHotels', findAllHotels);

// needs authentication middleware
router.get('/getUserBookedHotels/:userId', authenticationMiddleware, getUserBookedHotels);
router.get('/findHotelById/:hotelId', authenticationMiddleware, findHotelById);
router.put('/updateHotel/:hotelId', authenticationMiddleware, updateHotel); // Assuming updateHotel uses the same controller as login

export default router;