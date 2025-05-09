import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String },
  subtitle: { type: String },
  message: { type: String },
  feedback: { type: String }, // <<< هنا
  highlighted: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
