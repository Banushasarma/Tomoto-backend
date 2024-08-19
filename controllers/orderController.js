import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import 'dotenv/config'
import Stripe from "stripe";

// Stripe API setup

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// place order
const placeOrder = async (req, res) => {

    try {
        //Create new order
        const newOrder = await orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();

        //Clear the cart data of the user
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery charges",
                },
                unit_amount: 2 * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({ success: true, message: "Order placed successfully", session_url: session.url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//verify order
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;
        if (success) {
            await orderModel.findByIdAndUpdate(orderId, { Payment: true });
            res.json({ success: true, message: "Paid" });
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }

    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//User's orders history

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}


export { placeOrder, verifyOrder, userOrders }