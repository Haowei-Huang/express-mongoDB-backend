import express from 'express';
import { authenticationMiddleware } from '../controllers/user.controller.js';
import { findBookingByUserId, findAllBookings, createBooking } from '../controllers/booking.controller.js';
const router = express.Router();

router.post('/createBooking', createBooking);
// needs authentication middleware
router.get('/findBookingByUserId/:userId', authenticationMiddleware, findBookingByUserId);
router.get('/findAllBookings', authenticationMiddleware, findAllBookings);

export default router;