import { validationResult } from "express-validator";
import Course  from "../Modules/Course.model.js";
import AppError from "../utils/appError.js";
import catchSomthing from "../Middleware/asyncWrapper.js";
import httpsStatusText from "../utils/httpsStatusText.js";
import Booking from "../Modules/Booking.Model.js";

// get all courses
const getAllCourses = catchSomthing (async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, {"__v" : false}).limit(limit).skip(skip);
    res.json({status: httpsStatusText.SUCCESS , data: {courses}});
});


// create a course
const createCourse = catchSomthing (async (req, res , next) => {
    const errors =  validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppError(errors.array(), 400, httpsStatusText.FAIL);
        return next(error);
    }

    const { name, teacher, schedules, title, description, duration, price, image, video } = req.body;
    if (!schedules || schedules.length === 0) {
        const error = new AppError("Sessions are required.", 400, httpsStatusText.FAIL);
        return next(error);
    }

    schedules.forEach(session => {
        if (!session.date) {
            const error = new AppError("Each session must have a date.", 400, httpsStatusText.FAIL);
            return next(error);
        }
    });

    const newCourse = new Course({
        name,
        title,
        description,
        duration,
        price,
        image,
        video,
        schedules: schedules.map(session => ({
            date: new Date(session.date),
            totalSeats: session.totalSeats,
            bookedSeats: 0,
            isBooked: false
        }))
    });

    await newCourse.save();
    return res.json({status: httpsStatusText.SUCCESS , data:{newCourse}});
});


// get course by id
const getCourseById =catchSomthing  (async (req, res , next) => {

    const course = await Course.findById(req.params.id);
    if (!course) {
        const error = new AppError("Course not found", 404, httpsStatusText.FAIL);
        return next(error);
    }
    return res.status(200).json({status: "success", data: {course}});
});

// update course by id
const updateCourseById = catchSomthing (async (req, res , next) => {
    const id = req.params.id;
    const updateCourser = await Course.updateOne({_id: id} , {$set: req.body});
    return res.status(200).json({status: httpsStatusText.SUCCESS , data: {course:updateCourser}});
})


// delete course by id
const deleteCourseById = catchSomthing (async(req, res , next) => {

    await Course.deleteOne({_id: req.params.id});
    return res.status(204).json({status: httpsStatusText.SUCCESS, data: null});
});


export default {
    getAllCourses,
    createCourse,
    getCourseById,
    updateCourseById,
    deleteCourseById
 };
  