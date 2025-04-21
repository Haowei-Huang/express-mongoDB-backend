import db from '../server/db.js';
import { collectionExists } from './document.controller.js';

const findBookingByUserId = async (req, res) => {
    console.log("findBookingByUserId endpoint");

    try {
        const userId = req.params.userId;
        const response = await db.collection('bookings').find({ userId: userId }).toArray();
        res.status(200).json({ data: response });

    } catch (error) {
        console.error("Error in findBookingByUserId:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to findBookingByUserId' });
    }
}

export { findBookingByUserId }