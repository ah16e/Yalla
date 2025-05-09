import express from "express";
import CourseController from "../Controllers/CourseController.js";
import validationSchema from "../Middleware/validtionSchema.js";
import allowedTo from "../Middleware/allowedTo.js";
import userRole from "../utils/roles.js";
import verifyToken from "../Middleware/verfiyToken.js";
import multer from "multer";
import Course from "../Modules/Course.model.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "uploads/images/");
    } else if (file.fieldname === "video") {
      cb(null, "uploads/videos/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "image") {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"));
      }
    } else if (file.fieldname === "video") {
      if (!file.originalname.match(/\.(mp4|mov|avi|wmv)$/)) {
        return cb(new Error("Only video files are allowed!"));
      }
    }
    cb(null, true);
  },
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    const baseUrl = "http://localhost:3000/";
  
    const updatedData = courses.map(item => ({
      ...item._doc,
      image: item.image ? baseUrl + item.image.replace(/\\/g, '/') : null,
      video: item.video ? baseUrl + item.video.replace(/\\/g, '/') : null,
    }));
  
    res.status(200).json(updatedData);
  } catch (err) {
    console.error("Error in /courses route:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
  CourseController.getAllCourses;
});

router.post( "/",verifyToken,allowedTo(userRole.ADMIN), upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]), validationSchema(),
    async (req, res) => {
        try {
            if (!req.files["image"] || !req.files["video"]) {
                return res
                    .status(400)
                    .json({ message: "Both image and video are required" });
            }

            const courseData = {
                ...req.body,
                image: req.files["image"][0].path,
                video: req.files["video"][0].path,
              };
            
            const course = new Course(courseData);
            await course.save();
            res.status(201).json(course);
        } catch (error) {
            res.status(400).json({ message: error.message });
}});

router.get("/:id", CourseController.getCourseById);
router.patch("/:id", CourseController.updateCourseById);
router.delete("/:id",verifyToken,allowedTo(userRole.ADMIN),CourseController.deleteCourseById);

export { router };

