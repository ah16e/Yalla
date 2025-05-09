import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function MyProfile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const res = await axios.get("http://localhost:3000/api/v1/bookings/my", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const newBookings = res.data.data.bookings;
        
        // Compare with previous bookings to find newly confirmed ones
        const previousBookings = bookings;
        newBookings.forEach(newBooking => {
          const previousBooking = previousBookings.find(b => b._id === newBooking._id);
          if (newBooking.status === 'confirmed' && (!previousBooking || previousBooking.status !== 'confirmed')) {
            toast.success(`The course reservation has been confirmed.: ${newBooking.course?.name || 'Course'} !`);
          }
        });
        
        setBookings(newBookings);
      } catch {
        setBookings([]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (location.search.includes("success=1") && user) {
      // استرجع بيانات الحجز من localStorage أو state
      const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));
      if (!bookingData) return;

      axios.post("http://localhost:3000/api/v1/bookings", {
        course: bookingData.courseId,
        sessionDate: bookingData.sessionDate,
        paymentMethod: "card"
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(() => {
        // بعد نجاح الحجز، امسح الداتا المؤقتة
        localStorage.removeItem("pendingBooking");
        // جلب الحجوزات من جديد إذا أردت
        const fetchBookings = async () => {
          if (!user) return;
          try {
            const res = await axios.get("http://localhost:3000/api/v1/bookings/my", {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(res.data.data.bookings);
          } catch {
            setBookings([]);
          }
          setLoading(false);
        };
        fetchBookings();
      }).catch(() => {
        // احتفظ فقط بالخطأ بدون طباعة في الكونسول
      });
    }
  }, [location, user]);

  if (!user) {
    return <div className="p-8 max-w-5xl mx-auto">Loading profile...</div>;
  }

  // Helper to format date/time
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  };
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="text-gray-500">Beginner Learner</div>
          <div className="flex gap-4 mt-2">
            <span className="font-semibold">Learning</span>
            <span className="font-bold text-black">Arabic</span>
            <span className="font-bold text-black">English</span>
          </div>
        </div>
        <div className="sm:ml-auto text-gray-500 flex items-center gap-2 mt-4 sm:mt-0">
          <span role="img" aria-label="gift">🎁</span>
          <span>You have 10 points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Completed Lessons */}
        <div>
          <h3 className="text-xl font-bold mb-4">Completed Lessons</h3>
          <div className="text-gray-400 text-lg">No record yet</div>
        </div>

        {/* Upcoming Lessons */}
        <div>
          <h3 className="text-xl font-bold mb-4">Upcoming Lessons</h3>
          {loading ? (
            <div>Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="text-gray-400 text-lg">No upcoming lessons</div>
          ) : (
            bookings.map((booking) => {
              return (
                <div
                  key={booking._id}
                  className="flex flex-row-reverse items-center bg-gray-100 rounded-xl p-3 mb-3 shadow justify-between"
                >
                  <div className="flex flex-col items-center ml-4">
                    <a
                      href="#"
                      className="text-blue-600 underline text-sm mb-2 cursor-pointer pointer-events-none"
                      tabIndex={-1}
                      aria-disabled="true"
                    >
                      Lecture Link
                    </a>
                    <div className="text-center mt-1">
                      <div className="font-semibold text-base text-gray-800">
                        {booking.course?.teacher?.name || booking.name || "Teacher"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.sessionDate)} | {formatTime(booking.sessionDate)}
                      </div>
                    </div>
                    {booking.status === "pending" && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.delete(
                              `http://localhost:3000/api/v1/bookings/${booking._id}`,
                              { headers: { Authorization: `Bearer ${user.token}` } }
                            );
                            setBookings((prev) => prev.filter((b) => b._id !== booking._id));
                            toast.success("Booking cancelled successfully");
                          } catch {
                            toast.error("Error cancelling booking");
                          }
                        }}
                        className="mt-1 text-xs text-red-600 hover:text-red-800 font-bold border border-red-200 rounded px-2 py-0.5 transition"
                        title="Cancel booking"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg">
                      {booking.course?.name || "Course"}
                    </div>
                    <div className="text-gray-500">
                      {formatDate(booking.sessionDate)} | {formatTime(booking.sessionDate)}
                    </div>
                    <div className="mt-2 text-sm font-bold">
                      {booking.status === "pending" ? (
                        <span className="text-yellow-600">Pending</span>
                      ) : booking.status === "confirmed" ? (
                        <div>
                          <span className="text-green-600 font-bold">Confirmed</span>
                          <div className="mt-1 text-green-700 text-sm">
                            Reservation confirmed! Student code: <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">{booking.studentCode || "123456"}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">{booking.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}