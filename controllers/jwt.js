import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export function generateAccessToken(userEmail) {
    const token = jwt.sign({ userEmail },
        Buffer.from(process.env.JWT_PRIVATE, "base64"),
        {
            expiresIn: '1h',
            algorithm: 'RS256',
            issuer: 'express-mongodb-backend',
            audience: 'simplii-book'
        });
    return token;
}

// export function verifyAccessToken(token) {
//     try {
//         var decoded = jwt.verify(token, process.env.JWT_PUBLIC, {
//             issuer: 'express-mongodb-backend',
//             audience: 'simplii-book',
//             algorithms: ['RS256']
//         });
//         console.log("token is valid");
//         return { status: true }
//     } catch (err) {
//         console.log(err.name, err.message);
//         return {
//             status: false,
//             error: {
//                 name: err.name,
//                 message: err.message
//             }
//         }
//     }
// }