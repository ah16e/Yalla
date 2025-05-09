import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false, 
      },

    }, {_id: false});



const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: 'default_image_url'
    },
    video: {
        type: String,
        required: true
    },
    schedules: {
        type: [sessionSchema],
        required: true,
    },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;
