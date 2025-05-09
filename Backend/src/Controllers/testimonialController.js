import Testimonial from '../Modules/testimonilaModel.js'; // ✅ متطابق تماماً

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { text, name, subtitle, highlighted } = req.body;
    const testimonial = new Testimonial({ text, name, subtitle, highlighted });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
