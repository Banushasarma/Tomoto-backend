import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoute.js';

//app configuration
const app = express();
const port = 4000;

//middlewares
app.use(express.json());
app.use(cors());

//DB configuration
connectDB();

//API Endpoints
app.use("/images", express.static("uploads"));
app.use("/api/food", foodRouter);

app.get('/', (req, res) => {
    res.send("API is working.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});