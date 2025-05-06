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

const findAllBookings = async (req, res) => {
    console.log("findAllBookings endpoint");
    try {
        const collectionExist = await collectionExists('bookings');

        if (!collectionExist) {
            return res.status(404).json({ message: 'Collection bookings does not exist' });
        }

        const result = await db.collection('bookings').find().toArray();
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error in findAllBookings:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to find all bookings' });
    }
}

const createBooking = async (req, res) => {
    console.log("createBooking endpoint");
    try {
        const bookingData = req.body;
        const result = await db.collection('bookings').insertOne(bookingData);

        const documentCreated = await db.collection('bookings').findOne({ _id: result.insertedId });
        if (!documentCreated) {
            return res.status(500).json({ message: 'Failed to create document with id ' });
        }

        res.status(201).json({ data: result });
    } catch (error) {
        console.error("Error in createBooking:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to create booking' });
    }
}

export { findBookingByUserId, findAllBookings, createBooking };