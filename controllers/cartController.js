import e from "express";
import userModel from "../models/userModel.js";

//add items to the cart
const addToCart = async (req, res) => {
    try {
        //find user
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        //find food item in cart and add if it not exists else update it
        if (!cartData[req.body.itemId])
            cartData[req.body.itemId] = 1;
        else
            cartData[req.body.itemId]++;

        //update user's cart data to db
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Item added to cart successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//remove items from the cart
const removeFromCart = async (req, res) => {

    try {
        //find user
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        //remove item from cart if exists else do nothing
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Item removed from cart successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//fetche user cart data
const getCart = async (req, res) => {

    try {
        //find user
        let userData = await userModel.findById(req.body.userId);
        res.json({ success: true, data: userData.cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}


export { addToCart, removeFromCart, getCart }