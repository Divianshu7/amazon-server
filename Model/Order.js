import mongoose from "mongoose";
import { Schema } from "mongoose";
const orderSchema = new Schema({
    payIntent: {
        type: String,
        required: true
    },
    basket: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number
    }
}, { timestamps: true })
export default mongoose.model('Order', orderSchema)