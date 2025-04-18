import { ObjectId } from 'mongodb';
import db from '../server/db.js';
import { generateAccessToken } from './jwt.js';

const login = async (req, res) => {
    // case insensitive email check
    const user = await db.collection('users').findOne({ email: req.body.email.toLowerCase() });

    if (!user || user.password !== req.body.password) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateAccessToken(user.email);
    return res.status(200).send({ message: 'Login successful', token: token });
}

export { login }
