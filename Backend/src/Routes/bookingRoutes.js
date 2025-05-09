import express from 'express';
import bookingController from '../Controllers/bookingController.js';
import verifyToken from '../Middleware/verfiyToken.js';


const router = express.Router();

router.route('/').get(verifyToken , bookingController.getAllBookings).post(verifyToken , bookingController.createBooking);
router.route('/:id').put(bookingController.confirmedBooking).delete(verifyToken , bookingController.deleteBooking);
router.route('/my').get( verifyToken , bookingController.getUserBookings);
export default router;