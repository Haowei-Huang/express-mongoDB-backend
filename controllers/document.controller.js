import { ObjectId } from 'mongodb';
import db from '../server/db.js';

const findAll = async (req, res) => {
    console.log("findAll endpoint");
    const collectionName = req.params.collectionName;
    const collectionExist = await collectionExists(collectionName);
    if (!collectionExist) {
        return res.status(404).send({ message: 'Collection ' + collectionName + ' does not exist' });
    }
    const collection = await db.collection(collectionName);
    const result = await collection.find().toArray();
    res.status(200).send({ data: result });

};

const findById = async (req, res) => {
    console.log("findById endpoint");
    const collectionName = req.params.collectionName;
    const collectionExist = await collectionExists(collectionName);
    if (!collectionExist) {
        return res.status(404).send({ message: 'Collection ' + collectionName + ' does not exist' });
    }

    const _id = new ObjectId(req.params.documentId);
    const collection = await db.collection(collectionName);
    const result = await collection.findOne({ _id: _id });
    res.status(200).send({ data: result });
};

const insertOne = async (req, res) => {
    try {
        console.log("insertOne endpoint");
        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            db.createCollection(collectionName);
        }

        const collection = await db.collection(collectionName);
        const result = await collection.insertOne(req.body);
        console.log(result);
        const documentCreated = await collection.findOne({ _id: result.insertedId });
        if (!documentCreated) {
            return res.status(500).json({ message: 'Failed to create document with id ' + _id.toString() });
        }
        res.status(200).send(documentCreated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateById = async (req, res) => {
    try {
        console.log("updateById endpoint");
        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            return res.status(404).send({ message: 'Collection ' + collectionName + ' does not exist' });
        }

        const _id = new ObjectId(req.params.documentId);
        const collection = await db.collection(collectionName);
        const documentFound = await collection.findOne({ _id: _id });
        if (!documentFound) {
            return res.status(404).json({ message: 'document not found for id ' + _id.toString() });
        }

        delete req.body._id;
        await collection.replaceOne({ _id: _id }, req.body);
        const updatedDocument = await collection.findOne({ _id: _id });
        res.status(200).send(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteById = async (req, res) => {
    try {
        console.log("deleteById endpoint");
        const collectionName = req.params.collectionName;
        const collectionExist = await collectionExists(collectionName);
        if (!collectionExist) {
            return res.status(404).send({ message: 'Collection ' + collectionName + ' does not exist' });
        }

        const _id = new ObjectId(req.params.documentId);
        const collection = await db.collection(collectionName);
        const documentFound = await collection.findOne({ _id: _id });
        if (!documentFound) {
            return res.status(404).json({ message: 'document not found for id ' + _id.toString() });
        }

        await collection.deleteOne({ _id: _id });

        const documentDeleted = await collection.findOne({ _id: _id });
        if (documentDeleted) {
            return res.status(500).json({ message: 'Failed to delete document with id ' + _id.toString() });
        }
        res.status(200).send({ message: 'Successfully deleted document with id ' + _id.toString() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function collectionExists(collectionName) {
    const collections = await db.listCollections().toArray();//.map(collection => collection.name);
    //console.log(collections);
    return collections.some(collection => collection.name === collectionName);
}

export { findAll, findById, insertOne, updateById, deleteById };