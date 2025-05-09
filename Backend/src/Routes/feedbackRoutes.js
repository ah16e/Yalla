import express from "express";
import { addFeedback } from "../Controllers/feedbackController.js";
import verifyToken from "../Middleware/verfiyToken.js";

const router = express.Router();

router.post("/", verifyToken, addFeedback);

export default router;