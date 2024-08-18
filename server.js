import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

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
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get('/', (req, res) => {
    res.send("API is working.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});