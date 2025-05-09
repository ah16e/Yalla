import Feedback from "../Modules/feedbackModule.js";

export const addFeedback = async (req, res) => {
  try {
    const { teacher, comment, rating } = req.body;
    const user = req.currntUser.id; // تأكد أن عندك middleware للتحقق من التوكن
    const feedback = new Feedback({ teacher, user, comment, rating });
    await feedback.save();
    res.json({ status: "success", message: "Feedback sent!" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "Error saving feedback", error: err.message });
  }
};