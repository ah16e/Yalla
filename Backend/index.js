import express  from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { router as coursesRouter } from './src/Routes/coursesRoutes.js';
import userRoutes from './src/Routes/userRoutes.js';
import httpsStatusText from './src/utils/httpsStatusText.js';
import bookingRoutes from './src/Routes/bookingRoutes.js';
import cors from 'cors';
import testimonialRoutes from './src/Routes/testimonialRoutes.js';
import paymentRoutes from './src/Routes/paymentRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import feedbackRoutes from './src/Routes/feedbackRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const app = express();

const url  = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log('Database connected successfully');
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/feedback', feedbackRoutes);

app.use((error,req, res, next)=>{
    res.status(error.statusCode || 500).json({status: error.statusText || httpsStatusText.ERROR, message: error.message , code: error.statusCode || 500 , data:null})
})



const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000 , () => {
    console.log(`Server is running on port ${PORT}`);
});