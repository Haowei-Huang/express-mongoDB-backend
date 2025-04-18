import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/document.routes.js';
import userRoutes from './routes/user.routes.js';
import { expressjwt } from "express-jwt";

//app
const app = express();

// middle ware
app.use(express.json())
app.use(cors());

app.use('/user', userRoutes);

app.use(
    expressjwt({
        secret: Buffer.from(process.env.JWT_PUBLIC, "base64"),
        algorithms: ['RS256'],
        issuer: 'express-mongodb-backend',
        audience: 'simplii-book',
        onExpired: async (req, err) => {
            if (new Date() - err.inner.expiredAt < 5000) {
                return;
            }
            throw err;
        }
    })
)

// routes
app.use('/document', documentRoutes);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError'
        || err.name === 'JsonWebTokenError'
        || err.name === 'TokenExpiredError') {
        return res.status(401).send(err.message);
    }

    console.error(err);
    return res.status(500).send('Internal Server Error');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

export default app;