import userController from "../Controllers/userController.js";
import allowedTo from "../Middleware/allowedTo.js";
import verifyToken from "../Middleware/verfiyToken.js";
import AppError from "../utils/appError.js";
import express from "express";
import multer from "multer";
import userRole from "../utils/roles.js";
import upload from "../Middleware/multer.js";
const router = express.Router();





router.route('/').get(verifyToken , allowedTo(userRole.ADMIN) , userController.getAllUsers)

router.route('/register').post(upload.single("avatar") ,userController.register);
router.route('/login').post(userController.login)
router.patch('/me/avatar', verifyToken, upload.single('avatar'), userController.updateAvatar);

export default router;