import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";

function extractBookings(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.bookings)) return data.bookings;
  if (data && data.data && Array.isArray(data.data.bookings)) return data.data.bookings;
  if (data && data.data && Array.isArray(data.data)) return data.data;
  return [];
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: "",
    teacher: "",
    title: "",
    description: "",
    price: "",
    image: null,
    video: null,
    scheduleDate: "",
    scheduleIsBooked: false,
  });
  const [courses, setCourses] = useState([]);
  const [editCourseLoading, setEditCourseLoading] = useState(false);
  const [editCourseError, setEditCourseError] = useState("");
  const [editCourseInputs, setEditCourseInputs] = useState({});
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  console.log('Current user:', user);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || user.role !== "admin") return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/bookings`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const bookingsArr = extractBookings(res.data);
        setBookings(bookingsArr);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        toast.error("Error fetching bookings");
        setBookings([]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (activeTab === "editCourse") {
      fetchCourses();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  useEffect(() => {
    // Fetch courses on mount so the list is always up to date
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const fetchCourses = async () => {
    setEditCourseLoading(true);
    setEditCourseError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/courses`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCourses(res.data.data || res.data || []);
      // Initialize edit inputs
      const inputs = {};
      (res.data.data || res.data || []).forEach(c => {
        inputs[c._id] = {
          name: c.name || "",
          title: c.title || "",
          description: c.description || "",
          price: c.price || "",
          image: "",
          video: "",
          active: c.active !== undefined ? c.active : true,
        };
      });
      setEditCourseInputs(inputs);
    } catch {
      setEditCourseError("Failed to fetch courses");
    }
    setEditCourseLoading(false);
  };

  const handleEditCourseInput = (id, e) => {
    const { name, value, files } = e.target;
    setEditCourseInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: files ? files[0] : value,
      },
    }));
  };

  const handleUpdateCourse = async (id) => {
    try {
      const input = editCourseInputs[id];
      const formData = new FormData();
      let hasFile = false;
      if (input.image && typeof input.image !== "string") {
        formData.append("image", input.image);
        hasFile = true;
      }
      if (input.video && typeof input.video !== "string") {
        formData.append("video", input.video);
        hasFile = true;
      }
      if (hasFile) {
        if (input.name) formData.append("name", input.name);
        if (input.title) formData.append("title", input.title);
        if (input.description) formData.append("description", input.description);
        if (input.price) formData.append("price", input.price);
        if (typeof input.active === "boolean") formData.append("active", input.active);
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/courses/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          }
        });
      } else {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/courses/${id}`,
          {
            name: input.name,
            title: input.title,
            description: input.description,
            price: input.price,
            active: input.active,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` }
          }
        );
      }
      toast.success("Course updated successfully!");
      fetchCourses();
    } catch {
      toast.error("Error updating course");
    }
  };

  const handleCourseInput = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setCourseForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setCourseForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setCourseForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setAddingTeacher(true);
    try {
      const formData = new FormData();
      formData.append("name", courseForm.name);
      formData.append("teacher", courseForm.teacher);
      formData.append("title", courseForm.title);
      formData.append("description", courseForm.description);
      formData.append("price", courseForm.price);
      if (courseForm.image) formData.append("image", courseForm.image);
      if (courseForm.video) formData.append("video", courseForm.video);
      formData.append("schedules[0][date]", courseForm.scheduleDate);
      formData.append("schedules[0][isBooked]", courseForm.scheduleIsBooked);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/courses`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Course added successfully!");
      setCourseForm({
        name: "",
        teacher: "",
        title: "",
        description: "",
        price: "",
        image: null,
        video: null,
        scheduleDate: "",
        scheduleIsBooked: false,
      });
    } catch {
      toast.error("Error adding course");
    }
    setAddingTeacher(false);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/courses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success("Course deleted successfully!");
      fetchCourses();
    } catch {
      toast.error("Error deleting course");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const newActive = !editCourseInputs[id].active;
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/courses/${id}`, { active: newActive }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success(`Course is now ${newActive ? 'active' : 'inactive'}`);
      fetchCourses();
    } catch {
      toast.error("Error updating course status");
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Booking confirmed successfully!");
      // Refresh bookings
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/bookings`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const bookingsArr = extractBookings(res.data);
      setBookings(bookingsArr);
    } catch {
      toast.error("Error confirming booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      toast.success("Booking cancelled successfully!");
    } catch {
      toast.error("Error cancelling booking");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-4">You must be an admin to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-bold ${activeTab === "bookings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("bookings")}
        >
          All Bookings
        </button>
        <button
          className={`ml-4 px-4 py-2 font-bold ${activeTab === "addTeacher" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("addTeacher")}
        >
          Add Teacher
        </button>
        <button
          className={`ml-4 px-4 py-2 font-bold ${activeTab === "editCourse" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("editCourse")}
        >
          Edit Course
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "bookings" && (
        <React.Fragment>
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
            </div>
            <div className="border-t border-gray-200">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No bookings found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {booking.course?.name || booking.course?.title || 'No course name'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Student: {booking.user?.name || booking.user?.email || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {booking.sessionDate ? new Date(booking.sessionDate).toLocaleDateString() : 'No date'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Time: {booking.sessionDate ? new Date(booking.sessionDate).toLocaleTimeString() : 'No time'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: <span className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {booking.status || 'No status'}
                            </span>
                          </p>
                        </div>
                        {booking.status === "confirmed" && (
                          <span className="text-green-600 font-medium">Confirmed</span>
                        )}
                        {booking.status === "cancelled" && (
                          <span className="text-red-600 font-medium">Cancelled</span>
                        )}
                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleConfirmBooking(booking._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                          >
                            Confirm Booking
                          </button>
                        )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition ml-2"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </React.Fragment>
      )}

      {activeTab === "addTeacher" && (
        <div>
          {!showAddCourseModal ? (
            <div className="flex justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg mt-10"
                onClick={() => setShowAddCourseModal(true)}
              >
                Add Course
              </button>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow p-8 max-w-lg w-full relative">
                {/* X icon */}
                <button
                  className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-600"
                  onClick={() => setShowAddCourseModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                <form onSubmit={handleAddCourse} className="space-y-4" encType="multipart/form-data">
                  <div>
                    <label className="block font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={courseForm.name}
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Teacher ID</label>
                    <input
                      type="text"
                      name="teacher"
                      value={courseForm.teacher}
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={courseForm.title}
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                      name="description"
                      value={courseForm.description}
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Video</label>
                    <input
                      type="file"
                      name="video"
                      accept="video/*"
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={courseForm.price}
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Schedule Date</label>
                    <input
                      type="datetime-local"
                      name="scheduleDate"
                      value={courseForm.scheduleDate}
                      onChange={handleCourseInput}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Is Booked</label>
                    <input
                      type="checkbox"
                      name="scheduleIsBooked"
                      checked={courseForm.scheduleIsBooked}
                      onChange={handleCourseInput}
                      className="ml-2"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      onClick={() => setShowAddCourseModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      disabled={addingTeacher}
                    >
                      {addingTeacher ? "Adding..." : "Add Course"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "editCourse" && (
        <div className="bg-white rounded-lg shadow p-8 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Edit Courses</h2>
          {editCourseLoading ? (
            <div>Loading...</div>
          ) : editCourseError ? (
            <div className="text-red-600">{editCourseError}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl shadow p-6 flex flex-col gap-4 w-full max-w-xs transition-transform duration-200 hover:shadow-lg hover:scale-105"
                >
                  <div className="flex flex-col items-center mb-2">
                    <img
                      src={course.image || 'https://via.placeholder.com/120x120'}
                      alt={course.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow"
                    />
                    <div className="mt-2 text-lg font-bold">{editCourseInputs[course._id]?.name || 'No Name'}</div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${editCourseInputs[course._id]?.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {editCourseInputs[course._id]?.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {editingId === course._id ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={editCourseInputs[course._id]?.title || ""}
                          onChange={e => handleEditCourseInput(course._id, e)}
                          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Description</label>
                        <textarea
                          name="description"
                          value={editCourseInputs[course._id]?.description || ""}
                          onChange={e => handleEditCourseInput(course._id, e)}
                          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Price</label>
                        <input
                          type="number"
                          name="price"
                          value={editCourseInputs[course._id]?.price || ""}
                          onChange={e => handleEditCourseInput(course._id, e)}
                          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Image</label>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={e => handleEditCourseInput(course._id, e)}
                          className="border border-gray-300 px-2 py-1 rounded-lg w-full"
                        />
                        {course.image && (
                          <img src={course.image} alt="Course" className="mt-2 w-16 h-16 object-cover rounded" />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Video</label>
                        <input
                          type="file"
                          name="video"
                          accept="video/*"
                          onChange={e => handleEditCourseInput(course._id, e)}
                          className="border border-gray-300 px-2 py-1 rounded-lg w-full"
                        />
                        {course.video && (
                          <a href={course.video} target="_blank" rel="noopener noreferrer" className="block mt-1 text-blue-600 underline text-xs">View Video</a>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition"
                          onClick={() => {
                            handleUpdateCourse(course._id);
                            setEditingId(null);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg shadow transition"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm">
                        <p className="font-semibold">Title:</p>
                        <p className="text-gray-600">{editCourseInputs[course._id]?.title || 'No title'}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold">Description:</p>
                        <p className="text-gray-600">{editCourseInputs[course._id]?.description || 'No description'}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold">Price:</p>
                        <p className="text-gray-600">${editCourseInputs[course._id]?.price || '0'}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition"
                          onClick={() => setEditingId(course._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow transition"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                  <button
                    className={`w-full mt-2 py-2 rounded-lg font-semibold shadow transition ${
                      editCourseInputs[course._id]?.active
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`}
                    onClick={() => handleToggleActive(course._id)}
                  >
                    {editCourseInputs[course._id]?.active ? 'Set Inactive' : 'Set Active'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}