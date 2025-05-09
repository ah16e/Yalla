import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendBookingConfirmationEmail = async (userEmail, courseName, sessionDate) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Course Booking Confirmation',
        html: `
            <h1>Booking Confirmation</h1>
            <p>Dear Student,</p>
            <p>Your booking for the course "${courseName}" has been confirmed.</p>
            <p>Session Date: ${new Date(sessionDate).toLocaleDateString()}</p>
            <p>Thank you for choosing our platform!</p>
            <p>Best regards,<br>Yalla Course Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
