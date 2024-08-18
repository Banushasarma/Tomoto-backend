import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item
const addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image: image_filename,
    });

    try {
        await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//All food list 
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//Remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findByIdAndDelete(req.body.id);

        if (!food) return res.status(404).json({ success: false, message: "Food not found" });

        fs.unlinkSync(`uploads/${food.image}`);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

export { addFood, listFood, removeFood };