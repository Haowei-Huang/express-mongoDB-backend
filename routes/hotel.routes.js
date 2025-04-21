import express from 'express';
import { getUserBookedHotels } from '../controllers/hotel.controller.js';
const router = express.Router();

router.get('/getUserBookedHotels/:userId', getUserBookedHotels);

export default router;