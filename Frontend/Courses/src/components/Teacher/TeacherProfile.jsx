import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ScheduleModal from "../ScheduleModal/ScheduleModal";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/courses/${id}`).then((res) => {
      setTeacher(res.data.data.course);
    });
  }, [id]);

  const handleSendFeedback = async () => {
    if (!feedbackText) return;
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/feedback`,
      {
        teacher: teacher._id,
        comment: feedbackText,
        rating,
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    toast.success("Feedback sent successfully!");
    setShowFeedback(false);
    setFeedbackText("");
    setRating(5);
  };

  if (!teacher) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left/Main Column */}
      <div className="md:col-span-2">
        {/* Teacher Card Header */}
        <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center gap-6 p-6 mb-8">
          <img
            src={`${import.meta.env.VITE_API_URL}/${teacher.image}`}
            alt={teacher.name}
            className="w-28 h-28 rounded-xl object-cover border-2 border-blue-200 shadow-sm flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-800">{teacher.name}</h1>
              <span className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5 ml-2">PROFESSIONAL TEACHER</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-1">
              <span className="font-semibold">Speaks:</span>
              <span className="text-blue-600 font-medium">Arabic</span>
              <span className="text-blue-600 font-medium">English</span>
              <span className="text-blue-600 font-medium">Hebrew</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">
              <span className="font-semibold">Certificate</span> Native Arabic and International Certified Teacher with 5 years of Experience
            </div>
            <div className="flex gap-6 mt-2">
              <a href="#about" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">About Me</a>
              <a href="#course" className="text-gray-500 font-semibold hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-0.5">About the course</a>
            </div>
          </div>
        </div>
        {/* About Me Section */}
        <div id="about" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-2">About Me</h2>
          <p className="text-gray-700 mb-2">{teacher.description}</p>
        </div>
        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">63 Review (4.3)</h2>
          <div className="flex flex-wrap gap-4">
            {/* Example review cards */}
            <div className="bg-gray-100 p-4 rounded flex-1 min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sophia Loyad" className="w-8 h-8 rounded-full" />
                <span className="font-semibold">Sophia Loyad</span>
                <span className="text-yellow-400 ml-auto">★★★★★</span>
              </div>
              <p className="text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            </div>
            <div className="bg-gray-100 p-4 rounded flex-1 min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Cody Fisher" className="w-8 h-8 rounded-full" />
                <span className="font-semibold">Cody Fisher</span>
                <span className="text-yellow-400 ml-auto">★★★★★</span>
              </div>
              <p className="text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right Sidebar */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <video
            src={`${import.meta.env.VITE_API_URL}/${teacher.video}`}
            controls
            className="w-full rounded mb-4 max-h-56 object-cover"
          />
          <div className="text-center flex gap-6 items-center mb-4">
            <h3 className="text-xl font-bold">Session</h3>
            <p className="text-2xl font-bold text-blue-600">${teacher.price}</p>
          </div>
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="w-full bg-blue-600 text-white py-2 rounded mb-2"
          >
            Schedule a Lesson now
          </button>
          <ScheduleModal isOpen={isScheduleOpen} closeModal={() => setIsScheduleOpen(false)} />
          <button className="w-full border border-gray-300 py-2 rounded mb-2">Contact teacher</button>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <button
            className="w-full border border-gray-300 py-2 rounded mb-2"
            onClick={() => setShowFeedback(!showFeedback)}
          >
            Give {teacher.name.split(' ')[0]}'s feedback
            <span className={`ml-2 transition-transform ${showFeedback ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showFeedback && (
            <div className="mt-2 bg-gray-50 p-4 rounded shadow flex flex-col gap-2">
              <label className="font-semibold">Your Feedback</label>
              <textarea
                className="border rounded p-2"
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                rows={3}
                placeholder="Write your feedback..."
              />
              <div className="flex items-center gap-2">
                <span>Rating:</span>
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >★</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={handleSendFeedback}
                >
                  Send
                </button>
                <button
                  className="bg-gray-300 px-4 py-1 rounded"
                  onClick={() => setShowFeedback(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
