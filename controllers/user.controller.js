import { ObjectId } from 'mongodb';
import db from '../server/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from './jwt.js';
import { collectionExists } from './document.controller.js';

function authenticationMiddleware(req, res, next) {
    // get access token from headers, refresh token from cookies
    // the token is usually like 'Bearer <token>'
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies?.refreshToken;
    // console.log("accessToken:", accessToken);
    // console.log("refreshToken:", refreshToken);

    // if no token provided, deny the request
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    // if access token is provided, verify it
    let result = verifyAccessToken(accessToken);
    if (result.verified) {
        next();
    } else {
        // otherwise, verify refresh token
        if (!refreshToken) {
            return res.status(401).json({ message: 'Access denied, no refresh token provided' });
        }

        const result = verifyRefreshToken(refreshToken);
        if (result.verified) {
            // get new refresh token and access token
            const newAccessToken = generateAccessToken(result.email);
            const newRefreshToken = generateRefreshToken(result.email);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 1 * 60 * 60 * 1000 // 1 hours
            });

            return res.status(200).json({ message: 'Authentication successfully', token: newAccessToken });
        } else {
            return res.status(401).json({ message: 'Access denied, invalid tokens' });
        }
    }
}

// login with email and password
// return access token in body, refresh token in http-only cookies
const login = async (req, res) => {
    console.log("login endpoint");
    try {
        // case insensitive email check
        const user = await db.collection('users').findOne({ email: req.body.email.toLowerCase() });

        if (!user || user.password !== req.body.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate access token and refresh token
        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        // Assign refresh token in http-only cookie
        // this will prevent the cookie being read by javascript to prevent XSS attack
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 1 * 60 * 60 * 1000 // 1 hours
        });

        return res.status(200).json({ message: 'Login successfully', user: user, token: accessToken });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to login' });
    }

}

// refresh both access token and refresh token when user asks for a new access token
const refreshAccessToken = async (req, res) => {
    if (req.cookies?.refreshToken) {
        const refreshToken = req.cookies.refreshToken;
        // verify refresh token
        const result = verifyRefreshToken(refreshToken);

        if (result.verified) {
            // Generate new access token and refresh token
            const newAccessToken = generateAccessToken(result.email);
            const newRefreshToken = generateRefreshToken(result.email);
            // Assign refresh token in http-only cookie
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 1 * 60 * 60 * 1000 // 1 hours
            });

            return res.status(200).json({ message: 'Refresh access token successfully', token: newAccessToken });
        } else {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
    } else {
        return res.status(401).json({ message: 'Access denied, no refresh token found' });
    }
}

const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    res.clearCookie("refreshToken");
    res.sendStatus(204);
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

export { authenticationMiddleware, login, findUserByEmail, register, refreshAccessToken, logout };
