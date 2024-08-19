import express from 'express';
import { placeOrder, verifyOrder, userOrders } from '../controllers/orderController.js'
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/place', authMiddleware, placeOrder);
router.post('/verify', verifyOrder);
router.post('/userorders', authMiddleware, userOrders);

export default router;