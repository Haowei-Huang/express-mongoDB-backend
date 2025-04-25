import express from 'express';
import { findBookingByUserId, findAllBookings, createBooking } from '../controllers/booking.controller.js';
const router = express.Router();

router.get('/findBookingByUserId/:userId', findBookingByUserId);
router.get('/findAllBookings', findAllBookings);
router.post('/createBooking', createBooking); // Assuming createBooking uses the same controller as login


export default router;