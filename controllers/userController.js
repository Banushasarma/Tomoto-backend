import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import validator from "validator";
import 'dotenv/config'


//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        //check if user exists
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        //check if password matches
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid password" });

        //generate token
        const token = createToken(user._id);

        res.json({ success: true, message: "User logged in successfully", token });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        //check if user already
        const exists = await userModel.findOne({ email: email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        //validate email
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });

        //validate password
        if (!validator.isLength(password, { min: 8 })) return res.json({ success: false, message: "Password must be at least 8 characters long" });

        //Generate salt for password
        const salt = await bycrypt.genSalt(10);
        //hash password
        const hashedPassword = await bycrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        //generate token
        const token = createToken(user._id);

        res.status(201).json({ success: true, message: "User registered successfully", token });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
}

//Generate JWT token
const createToken = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}


export { loginUser, registerUser, createToken };
