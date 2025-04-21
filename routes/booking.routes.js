import express from 'express';
import { findBookingByUserId } from '../controllers/booking.controller.js';
const router = express.Router();

router.get('/findBookingByUserId/:userId', findBookingByUserId);

export default router;