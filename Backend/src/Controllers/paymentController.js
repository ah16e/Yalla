import Stripe from 'stripe';
import dotenv from 'dotenv';
import Booking from "../Modules/Booking.Model.js";
import Course from "../Modules/Course.model.js";
import User from "../Modules/userModel.js";
dotenv.config();

console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY); // Debug log

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { lessons, userId, courseId } = req.body;
  // احسب السعر الإجمالي
  const total = lessons.length * 29.39;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Yalla Lessons (${lessons.length})`,
          },
          unit_amount: Math.round(total * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:5173/myprofile?success=1',
    cancel_url: 'http://localhost:3000/checkout?canceled=1',
    metadata: {
      userId,
      lessons: JSON.stringify(lessons),
      courseId: courseId || (lessons[0]?.courseId || null)
    },
  });
  // ----------- تيست فقط: أنشئ الحجز مباشرة -----------
  const fallbackCourseId = "6817f70bfb4981ff452dd6d6"; // ضع هنا ID كورس موجود فعليًا في الداتا بيز
  if (userId && lessons && lessons.length > 0) {
    for (const lesson of lessons) {
      await Booking.create({
        user: userId,
        course: courseId || lesson.courseId || fallbackCourseId,
        sessionDate: lesson.date || Date.now(),
        paymentMethod: 'card',
        status: 'pending',
      });
    }
  }
  // ---------------------------------------------------
  res.json({ url: session.url });
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Stripe webhook received session:', session);
    console.log('Session metadata:', session.metadata);
    const userId = session.metadata.userId;
    const lessons = JSON.parse(session.metadata.lessons);
    // لكل درس، أنشئ Booking
    for (const lesson of lessons) {
      // تحتاج لتحديد course و sessionDate من lesson.label أو تعديل الداتا حسب مشروعك
      // مثال: lesson.label = "Sat May 04 2024 | 10:00 AM"
      // ستحتاج لجلب الكورس المناسب بناءً على الداتا
      // هنا سنفترض أن لديك courseId في metadata أو في lesson
      // سنستخدم paymentMethod = 'card' دائماً
      // ملاحظة: عدل هذا الجزء حسب هيكل بياناتك
      const courseId = session.metadata.courseId || null; // عدل حسب الحاجة
      if (!courseId) continue;
      await Booking.create({
        user: userId,
        course: courseId,
        sessionDate: new Date(lesson.date || Date.now()), // عدل حسب الحاجة
        paymentMethod: 'card',
        status: 'pending',
      });
    }
  }
  res.json({ received: true });
};