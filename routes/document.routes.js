import express from 'express';
const router = express.Router();
import { findAll, findById, insertOne, updateById, deleteById } from '../controllers/document.controller.js'

router.get('/findAll/:collectionName', findAll);

router.get('/findOne/:collectionName/:documentId', findById);

router.post('/createorupdate/:collectionName', insertOne);

router.put('/updateOne/:collectionName/:documentId', updateById);

router.delete('/deleteOne/:collectionName/:documentId', deleteById);

export default router;