import mongoose from "mongoose";
import validator from "validator";
import userRole from "../utils/roles.js";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: [userRole.ADMIN, userRole.USER, userRole.TEACHER],
        default: userRole.USER,
     
    },
    avatar: {
        type: String,
        default: "uploads/images/profile.jpg"
    }
});


export default mongoose.model("User", userSchema);