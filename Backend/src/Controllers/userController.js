import catchSomthing from "../Middleware/asyncWrapper.js";
import User from "../Modules/userModel.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import generateJWT from "../utils/genrateJWT.js";
import httpsStatusText from "../utils/httpsStatusText.js";

// register user
const register = catchSomthing(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        const error = new AppError("User already exists", 400, httpsStatusText.FAIL);
        return next(error);
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        avatar: req.file ? `http://localhost:3000/${req.file.path.replace(/\\/g, '/')}` : "http://localhost:3000/uploads/images/profile.jpg"
    });

    const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role });
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({ status: httpsStatusText.SUCCESS, data: { user: newUser } });
});

// login user
const login = catchSomthing(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email && !password) {
        const error = new AppError("Please provide email and password", 400, httpsStatusText.FAIL);
        return next(error);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        const error = new AppError("User not found", 404, httpsStatusText.FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (user && matchedPassword) {
        const token = await generateJWT({
            email: user.email,
            id: user._id,
            role: user.role,
        });
        return res.status(200).json({
            status: httpsStatusText.SUCCESS,
            data: {
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar ? `http://localhost:3000/${user.avatar.replace(/\\/g, '/')}` : "http://localhost:3000/uploads/images/profile.jpg"
                },
            },
        });
    } else {
        const error = new AppError("Invalid email or password", 500, httpsStatusText.FAIL);
        return next(error);
    }
});

// get all users
const getAllUsers = catchSomthing(async (req, res, next) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { "__v": false, password: false }).limit(limit).skip(skip);
    res.status(200).json({ status: httpsStatusText.SUCCESS, data: { users } });
});

export const updateAvatar = async (req, res) => {
    try {
      const user = await User.findById(req.currentUser.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (req.file) {
        user.avatar = req.file.path; // أو حسب طريقة حفظ الصور عندك
        await user.save();
        return res.json({ status: "success", avatar: user.avatar });
      }
      res.status(400).json({ message: "No file uploaded" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

export default {
    register,
    login,
    getAllUsers,
    updateAvatar
};