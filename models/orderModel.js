import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Array, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'Food Processing' },
    date: { type: Date, dafault: Date.now() },
    Payment: { type: Boolean, default: false }

});

const orderModel = mongoose.model('order', orderSchema);

export default orderModel;