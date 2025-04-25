import { ExplainVerbosity, ObjectId } from 'mongodb';
import db from '../server/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from './jwt.js';
import { collectionExists } from './document.controller.js';

// only used for protected routes
// the front end logic will be: send a request to the protected routes
// if the access token is valid, the request will be successful
// otherwise, it will return 401 status code
// then the front end will send a request to refresh the access token
function authenticationMiddleware(req, res, next) {
    // get access token from headers, refresh token from cookies
    // the token is usually like 'Bearer <token>'
    const accessToken = req.headers['authorization']?.split(' ')[1];
    // console.log("access token: ", accessToken);

    // if no token provided, deny the request
    if (!accessToken) {
        console.log("No access token provided");
        return res.status(401).json({ message: 'Access denied, no access token provided' });
    }

    // if access token is provided, verify it
    let result = verifyAccessToken(accessToken);
    if (result.verified) {
        console.log("Access token is valid");
        next();
    } else {
        console.log("Invalid access token");
        return res.status(401).json({ message: 'Access denied, invalid access tokens' });
    }
}

// login with email and password
// return access token in body, refresh token in http-only cookies
const login = async (req, res) => {
    console.log("login endpoint: ");
    try {
        // case insensitive email check
        const user = await db.collection('users').findOne({ email: req.body.email.toLowerCase() });

        if (!user || user.password !== req.body.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate access token and refresh token
        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        // store refresh token in database so that we can invalidate it later
        await db.collection('refreshTokens').insertOne({
            userId: user._id,
            token: refreshToken,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hours
        });

        // Assign refresh token in http-only cookie
        // this will prevent the cookie being read by javascript to prevent XSS attack
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // sameSite: 'None', // it has to be used with secure: true, which requires https with ssl certificate
            //secure: true,
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
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            console.log("No refresh token provided");
            return res.status(401).json({ message: 'Access denied, no refresh token found' });
        }

        // check if the refresh token is in the database
        // only unused refresh token will be stored in the database
        // we will delete refresh token from the database when it's used to generate new access token
        // or when the user logs out
        // or when the refresh token is expired
        const refreshTokenInDb = await db.collection('refreshTokens').findOne({ token: refreshToken });
        if (!refreshTokenInDb) {
            console.log("Refresh token not found in database");
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // verify refresh token
        const result = verifyRefreshToken(refreshToken);

        if (!result.verified) {
            console.log("Invalid refresh token");
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        console.log("Refresh token is valid");

        // Generate new access token and refresh token
        const newAccessToken = generateAccessToken(result.email);
        const newRefreshToken = generateRefreshToken(result.email);

        // update refresh token in database 
        await db.collection('refreshTokens').updateOne(
            {
                token: refreshToken
            },
            {
                $set: {
                    token: newRefreshToken,
                    createdAt: new Date(),
                    expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hours
                }
            }
        );

        // Assign refresh token in http-only cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            //sameSite: 'None', // it has to be used with secure: true, which requires https with ssl certificate
            // secure: true,
            maxAge: 1 * 60 * 60 * 1000 // 1 hours
        });

        return res.status(200).json({ message: 'Refresh access token successfully', token: newAccessToken });
    } catch (error) {
        console.error("Error in refreshAccessToken:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to refreshAccessToken' });
    }
}

const logout = async (req, res) => {
    console.log("logout endpoint: ");
    const refreshToken = req.cookies?.refreshToken;
    // delete refresh token from database
    try {
        await db.collection('refreshTokens').deleteOne({ token: refreshToken });
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({ message: 'Something went wrong when trying to logout' });
    }

    res.clearCookie('refreshToken', {
        httpOnly: true
    });
    return res.status(200).json({ message: 'Logout successfully' });
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
