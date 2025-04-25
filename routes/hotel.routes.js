import express from 'express';
import { getUserBookedHotels, findAllHotels, findHotelById, updateHotel } from '../controllers/hotel.controller.js';
const router = express.Router();

router.get('/getUserBookedHotels/:userId', getUserBookedHotels);
router.get('/findAllHotels', findAllHotels);
router.get('/findHotelById/:hotelId', findHotelById);
router.put('/updateHotel/:hotelId', updateHotel); // Assuming updateHotel uses the same controller as login

export default router;