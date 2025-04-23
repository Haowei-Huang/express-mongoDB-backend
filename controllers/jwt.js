import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export function generateAccessToken(userEmail) {
    const token = jwt.sign({ email: userEmail },
        Buffer.from(process.env.JWT_ACCESS_PRIVATE, "base64"),
        {
            expiresIn: '10m',
            algorithm: 'RS256',
            issuer: 'express-mongodb-backend',
            audience: 'simplii-book'
        });
    return token;
}

export function generateRefreshToken(userEmail) {
    const token = jwt.sign({ email: userEmail },
        Buffer.from(process.env.JWT_REFRESH_PRIVATE, "base64"),
        {
            expiresIn: '1h',
            algorithm: 'RS256',
            issuer: 'express-mongodb-backend',
            audience: 'simplii-book'
        });
    return token;
}

export function verifyAccessToken(token) {
    try {
        var decoded = jwt.verify(token, process.env.JWT_ACCESS_PUBLIC, {
            issuer: 'express-mongodb-backend',
            audience: 'simplii-book',
            algorithms: ['RS256']
        });
        console.log("token is valid");
        return { verified: true, email: decoded.email }
    } catch (err) {
        console.log(err.name, err.message);
        return {
            verified: false,
            error: {
                name: err.name,
                message: err.message
            }
        }
    }
}

export function verifyRefreshToken(token) {
    try {
        var decoded = jwt.verify(token, process.env.JWT_REFRESH_PUBLIC, {
            issuer: 'express-mongodb-backend',
            audience: 'simplii-book',
            algorithms: ['RS256']
        });
        console.log("token is valid");
        const newAccessToken = generateAccessToken(decoded.userEmail);
        return { verified: true, accessToken: newAccessToken, email: decoded.email };
    } catch (err) {
        console.log(err.name, err.message);
        return {
            verified: false,
            error: {
                name: err.name,
                message: err.message
            }
        }
    }
}