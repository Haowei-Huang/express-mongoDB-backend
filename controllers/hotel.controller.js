import db from '../server/db.js';
import { collectionExists } from './document.controller.js';

async function getUserBookedHotels(req, res) {
    const userId = req.params.userId;

    const booking = db.collection('bookings');
    const pipeline = [
        { $match: { userId: userId } }, // find by user
        { $group: { _id: "$hotel" } }, //group by hotel, hotel field in bookings is the '_id' in hotels
        {
            $addFields: {
                hotelObjectId: { $toObjectId: "$_id" } // Convert hotel string ID to ObjectId
            }
        },
        {
            $lookup: {
                from: "hotels",
                localField: "hotelObjectId", // The hotel ID from the group step
                foreignField: "_id", // hotelId in hotels collection
                as: "hotelData"
            }
        },
        { $unwind: "$hotelData" }, // unwind the array created by lookup
        { $replaceRoot: { newRoot: "$hotelData" } } // replace the root to only return hotel Data
    ]

    try {
        const response = await booking.aggregate(pipeline).toArray();
        res.status(200).json({ data: response });
    } catch (error) {
        console.error("Error in getUserBookedHotels: " + error.message);
        return res.status(500).json({ message: 'Something went wrong when trying to getUserBookedHotels' });
    }

};

export { getUserBookedHotels }