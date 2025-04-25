import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/document.routes.js';
import userRoutes from './routes/user.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import hotelRoutes from './routes/hotel.routes.js';
import { authenticationMiddleware } from './controllers/user.controller.js';
import cookieParser from 'cookie-parser';

//app
const app = express();

// middle ware
app.use(express.json())
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3001'
}
app.use(cors(corsOptions));
// get http-only cookies for refresh token
app.use(cookieParser());

app.use('/user', userRoutes);

// jwt based middleware with access token and refresh token
app.use(authenticationMiddleware);

// routes
// app.use('/document', documentRoutes);
app.use('/booking', bookingRoutes);
app.use('/hotel', hotelRoutes);

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