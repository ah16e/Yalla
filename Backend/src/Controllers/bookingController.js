import Booking from "../Modules/Booking.Model.js";
import Course from "../Modules/Course.model.js";
import User from "../Modules/userModel.js";
import { sendBookingConfirmationEmail } from "../Service/sendEmail.js";

//  const createBooking = async (req, res) => {
//     try {
//         const {course , user , sessionDate} = req.body;
//         const courseData  = await Course.findById(course);
//         if (!courseData) {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         await courseData.save();

//         const booking = new Booking({
//             user,
//             course,
//             sessionDate,
//             status: "pending",
//         });
//         courseData.schedules.forEach((session) => {
//             if (session.date.toString() === new Date(sessionDate).toString()) {
//                 session.bookedSeats += 1;
//                 session.isBooked = true;
//             }
//         });

//         await booking.save();


//         res.status(201).json({ message: "Booking created successfully", booking });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Server error" });
//     }
// }

const createBooking = async (req, res) => {
    try {
      const { course, sessionDate, paymentMethod } = req.body;
      const user = req.currentUser.id;
  
      const courseData = await Course.findById(course);
      if (!courseData) {
        return res.status(404).json({ message: "Course not found" });
      }

      const userData = await User.findById(user);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const validPaymentMethods = ["card", "wallet", "points"];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method" });
      }
  
      courseData.schedules.forEach((session) => {
        if (session.date.toString() === new Date(sessionDate).toString()) {
          session.bookedSeats += 1;
          session.isBooked = true;
        }
      });
  
      await courseData.save();
  
      const booking = new Booking({
        user,
        course,
        sessionDate,
        paymentMethod,
        status: "pending",
      });
  
      await booking.save();

      // Send email notification
      try {
        await sendBookingConfirmationEmail(
          userData.email,
          courseData.name,
          sessionDate
        );
      } catch (emailError) {
        // Don't fail the booking if email fails
      }
  
      res.status(201).json({ message: "Booking created successfully", booking });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  


const getAllBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const bookings = await Booking.find(query).populate("user").populate("course").exec();
        res.json(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}


const confirmedBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking.status = "confirmed";
        await booking.save();
        res.json({ message: "Booking confirmed successfully", booking });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
        
    }
}


const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking.status = "cancelled";
        await booking.save();
        res.json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    } 
}

const getUserBookings = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    // Populate course, teacher, and course image/name
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "course",
        select: "name image teacher",
        populate: { path: "teacher", select: "name avatar" }
      });
    // تأكد أن كل booking يحتوي على اسم المدرس إن وجد
    const bookingsWithTeacher = bookings.map(b => ({
      ...b.toObject(),
      teacherName: b.course && b.course.teacher && b.course.teacher.name ? b.course.teacher.name : null
    }));
    res.json({ status: "success", data: { bookings: bookingsWithTeacher } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await Booking.deleteOne({ _id: req.params.id });
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export default {
    createBooking,
    getAllBookings,
    confirmedBooking,
    cancelBooking,
    getUserBookings,
    deleteBooking
};