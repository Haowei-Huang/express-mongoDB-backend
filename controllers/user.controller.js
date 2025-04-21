import { ObjectId } from 'mongodb';
import db from '../server/db.js';
import { generateAccessToken } from './jwt.js';
import { collectionExists } from './document.controller.js';

const login = async (req, res) => {
    console.log("login endpoint");
    try {
        // case insensitive email check
        const user = await db.collection('users').findOne({ email: req.body.email.toLowerCase() });

        if (!user || user.password !== req.body.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateAccessToken(user.email);
        return res.status(200).json({ message: 'Login successfully', user: user, token: token });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to login' });
    }

}

const register = async (req, res) => {
    console.log("register endpoint");
    try {
        // case insensitive email check
        const user = await db.collection('users').findOne({ email: req.body.email.toLowerCase() });

        // if user exist
        if (user) {
            return res.status(409).json({ message: 'This email is already used by others' })
        }

        // create user
        const response = await db.collection('users').insertOne(req.body);
        const createdUser = await db.collection('users').findOne({ _id: response.insertedId });

        return res.status(200).json({ message: 'Register successfully', ...createdUser });
    } catch (error) {
        console.error("error in register:", error);
        res.status(500).json({ message: 'Something went wrong when trying to register' });
    }

}

const findUserByEmail = async (req, res) => {
    console.log("findUserByEmail endpoint");
    const userEmail = req.params.userEmail.toLowerCase();
    const collectionExist = await collectionExists('users');

    if (!collectionExist) {
        return res.status(404).json({ message: 'Collection users does not exist' });
    }

    const result = await db.collection('users').findOne({ email: userEmail });
    res.status(200).json({ data: result });
}

export { login, findUserByEmail, register };
