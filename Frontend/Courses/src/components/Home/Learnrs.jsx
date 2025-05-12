import React, { useEffect, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Learnrs() {
  const [testimonials, setTestimonials] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/testimonials`);
        setTestimonials(res.data.reverse());
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSubmit = async () => {
    if (!feedback.trim() || !name.trim()) {
      alert("Please enter both your name and feedback.");
      return;
    }

    try {
      const newFeedback = {
        name: name.trim(),
        message: feedback.trim(),
        highlighted: false,
      };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/testimonials`, newFeedback);
      setTestimonials([res.data, ...testimonials]);
      setFeedback("");
      setName("");
      toast.success("Thank you for your feedback! 🎉");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const displayedTestimonials = showAll
    ? testimonials
    : testimonials.slice(0, 17);

  return (
    <div className="bg-white py-16 px-4 md:px-12 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
        Our learners, Our Success
      </h2>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 text-center">
        {displayedTestimonials.map((t, i) =>
          (t.text || t.message) ? (
            <div
              key={i}
              className={`flex flex-col items-center justify-between px-6 py-8 rounded-3xl transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[240px]
                ${t.highlighted
                  ? "bg-white shadow-lg border border-gray-200 text-gray-800"
                  : "bg-gray-50 text-gray-400"
                }`}
            >
              <FaQuoteLeft
                className={`text-4xl mb-4 ${
                  t.highlighted ? "text-blue-500" : "text-orange-300"
                }`}
              />
              <p className="text-sm md:text-base mb-4 leading-relaxed text-center">
                {t.text || t.message}
              </p>
              <div className="mt-auto text-center">
                <p className="text-xs font-semibold">{t.name}</p>
                {t.subtitle && <p className="text-[10px] italic">{t.subtitle}</p>}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* See More / Less Button */}
      {testimonials.length > 8 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            {showAll ? "See Less" : "See More"}
          </button>
        </div>
      )}

      {/* Feedback Section */}
      <div className="mt-24 bg-gradient-to-r from-blue-100 to-blue-200 py-10 px-6 rounded-xl text-center">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
          Help us improve, Rate your experience
        </h3>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-md"
          >
            Give us your feedback
          </button>
        )}

        {showForm && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Write your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-md"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFeedback("");
                  setName("");
                }}
                className="bg-red-700 text-white px-6 py-2 rounded-full font-medium hover:bg-red-400 transition shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
