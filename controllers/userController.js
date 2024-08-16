import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import validator from "validator";
import 'dotenv/config'
//login user
const loginUser = async (req, res) => {

}

//Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        //check if user already
        const exists = await userModel.findOne({ email: email });
        if (exists) return res.status(400).json({ success: false, message: "User already exists" });

        //validate email
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid email" });

        //validate password
        if (!validator.isLength(password, { min: 8 })) return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });

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
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//Generate JWT token
const createToken = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

//check password    
const checkPassword = (password, hashedPassword) => {

}

//check email   
const checkEmail = (email) => {

}

//validate email
const validateEmail = (email) => {

}

//validate password
const validatePassword = (password) => {

}

export { loginUser, registerUser, createToken as generateToken, checkPassword, checkEmail, validateEmail, validatePassword };
