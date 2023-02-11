import mongoose from "mongoose";
import { Schema } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    }
})

export default mongoose.model('Users', userSchema)