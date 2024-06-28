import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/document.routes.js';

//app
const app = express();

// middle ware
app.use(express.json())
app.use(cors());

// routes
app.use('/document', documentRoutes);

app.get('/', async (req, res) => {
    res.send('Hello from Node APIs');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

export default app;