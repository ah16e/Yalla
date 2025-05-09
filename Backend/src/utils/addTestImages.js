import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../Modules/Course.model.js';
import User from '../Modules/userModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

const TEST_COURSE_IMAGE = 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=facearea&w=400&h=400&q=80';
const TEST_TEACHER_AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';

async function addTestImages() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Update all courses
  const courseResult = await Course.updateMany({}, { image: TEST_COURSE_IMAGE });
  console.log(`Updated ${courseResult.nModified || courseResult.modifiedCount} courses with test image.`);

  // Update all teachers
  const teacherResult = await User.updateMany({ role: 'teacher' }, { avatar: TEST_TEACHER_AVATAR });
  console.log(`Updated ${teacherResult.nModified || teacherResult.modifiedCount} teachers with test avatar.`);

  await mongoose.disconnect();
  console.log('Done!');
}

addTestImages().catch(err => {
  console.error(err);
  process.exit(1);
}); 