import express from 'express';
import cors from 'cors';
import userRoutes from '../routes/user.routes.js';
import bookingRoutes from '../routes/booking.routes.js';
import hotelRoutes from '../routes/hotel.routes.js';
import cookieParser from 'cookie-parser';

//app
const app = express();

// middle ware
const corsOptions = {
    credentials: true,
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Accept']
}
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser()); // get http-only cookies for refresh token
// app.use(authenticationMiddleware); // jwt based middleware with access token and refresh token

// routes
app.use('/user', userRoutes);
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