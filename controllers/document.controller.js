import { ObjectId } from 'mongodb';
import db from '../server/db.js';

const findAll = async (req, res) => {
    console.log("findAll endpoint");
    try {

        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            return res.status(404).json({ message: 'Collection ' + collectionName + ' does not exist' });
        }
        const result = await db.collection(collectionName).find().toArray();
        res.status(200).json({ data: result });
    } catch (error) {
        console.log("Error in findAll:", error);
        res.status(500).json({ message: error.message });
    }
};

const findById = async (req, res) => {
    console.log("findById endpoint");
    try {

        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            return res.status(404).json({ message: 'Collection ' + collectionName + ' does not exist' });
        }

        const _id = new ObjectId(req.params.documentId);
        const result = await db.collection(collectionName).findOne({ _id: _id });
        res.status(200).json({ data: result });
    } catch (error) {
        console.log("Error in findById:", error);
        res.status(500).json({ message: error.message });
    }
};

const insertOne = async (req, res) => {
    console.log("insertOne endpoint");
    try {
        // when collection doesn't exist, insertOne will create it
        const collectionName = req.params.collectionName;

        const collection = db.collection(collectionName);
        const result = await collection.insertOne(req.body);

        const documentCreated = await collection.findOne({ _id: result.insertedId });
        if (!documentCreated) {
            return res.status(500).json({ message: 'Failed to create document with id ' + _id.toString() });
        }

        res.status(200).json(documentCreated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateById = async (req, res) => {
    console.log("updateById endpoint");
    try {
        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            return res.status(404).json({ message: 'Collection ' + collectionName + ' does not exist' });
        }

        const _id = new ObjectId(req.params.documentId);
        const collection = db.collection(collectionName);
        const documentFound = await collection.findOne({ _id: _id });
        if (!documentFound) {
            return res.status(404).json({ message: 'document not found for id ' + _id.toString() });
        }

        delete req.body._id;
        await collection.replaceOne({ _id: _id }, req.body);
        const updatedDocument = await collection.findOne({ _id: _id });
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteById = async (req, res) => {
    console.log("deleteById endpoint");
    try {
        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            return res.status(404).json({ message: 'Collection ' + collectionName + ' does not exist' });
        }

        const _id = new ObjectId(req.params.documentId);
        const collection = db.collection(collectionName);
        const documentFound = await collection.findOne({ _id: _id });
        if (!documentFound) {
            return res.status(404).json({ message: 'document not found for id ' + _id.toString() });
        }

        await collection.deleteOne({ _id: _id });

        const documentDeleted = await collection.findOne({ _id: _id });
        if (documentDeleted) {
            return res.status(500).json({ message: 'Failed to delete document with id ' + _id.toString() });
        }
        res.status(200).json({ message: 'Successfully deleted document with id ' + _id.toString() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const countDocuments = async (req, res) => {
    console.log("countDocuments endpoint");
    try {
        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            return res.status(404).json({ message: 'Collection ' + collectionName + ' does not exist' });
        }

        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(count);
        res.status(200).json({ count: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function collectionExists(collectionName) {
    const collections = await db.listCollections().toArray();//.map(collection => collection.name);
    return collections.some(collection => collection.name === collectionName);
}

export { findAll, findById, insertOne, updateById, deleteById, collectionExists, countDocuments };