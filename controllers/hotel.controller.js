import db from '../server/db.js';
import { ObjectId } from 'mongodb';
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

const findAllHotels = async (req, res) => {
    console.log("findAllHotels endpoint");
    try {
        const collectionExist = await collectionExists('hotels');

        if (!collectionExist) {
            return res.status(404).json({ message: 'Collection hotels does not exist' });
        }

        const result = await db.collection('hotels').find().toArray();
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error in findAllHotels:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to find all hotels' });
    }
}

const findHotelById = async (req, res) => {
    console.log("findHotelById endpoint");
    try {
        const hotelId = new ObjectId(req.params.hotelId);
        const result = await db.collection('hotels').findOne({ _id: hotelId });
        // return null if not found
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error in findHotelById:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to find hotel by Id' });
    }
}

const updateHotel = async (req, res) => {
    console.log("updateHotel endpoint");
    try {
        const hotelId = new ObjectId(req.params.hotelId);
        const newHotelData = req.body;
        delete newHotelData._id;

        const result = await db.collection('hotels').replaceOne(
            { _id: hotelId },
            newHotelData
        );

        console.log("result of updateHotel: ", result);

        if (result.matchedCount !== 1) {
            return res.status(404).json({ message: 'document not found for id' + hotelId.toString() });
        }

        const updatedHotel = await db.collection('hotels').findOne({ _id: hotelId });
        res.status(200).json(updatedHotel);
    } catch (error) {
        console.error("Error in updateHotel:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to update hotel data' });
    }
}

export { getUserBookedHotels, findAllHotels, findHotelById, updateHotel }