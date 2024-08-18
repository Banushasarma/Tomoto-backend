import jwt from 'jsonwebtoken';
import 'dotenv/config'

const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.headers;
        // Check if token exists and is valid
        if (!token) return res.json({ success: false, message: 'No token provided.' });

        // Verify token and decode data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Not authorized to access this resource.' });
    }

}

export default authMiddleware;