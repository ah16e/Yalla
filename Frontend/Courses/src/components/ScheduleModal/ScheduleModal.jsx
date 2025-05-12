// components/ScheduleModal.jsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext";

export default function ScheduleModal({ isOpen, closeModal, teacherId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const { user } = useAuth();

  const timeOptions = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  useEffect(() => {
    if (teacherId) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/v1/lessons/booked/${teacherId}`)
        .then((res) => {
          setBookedSlots(res.data); // Format: [{ date: "2025-05-03", time: "10:00 AM" }]
        });
    }
  }, [teacherId]);

  const isTimeBooked = (date, time) => {
    const formattedDate = date.toISOString().split("T")[0];
    return bookedSlots.some(
      (slot) => slot.date === formattedDate && slot.time === time
    );
  };

  const handleTimeClick = (time) => {
    const formatted = `${selectedDate.toDateString()} | ${time}`;
    if (!selectedLessons.includes(formatted)) {
      setSelectedLessons([...selectedLessons, formatted]);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    const token = user?.token;
    const lessons = selectedLessons.map((lesson) => ({ label: lesson }));
    console.log('Sending checkout request with data:', { lessons, userId: user.id });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/payments/create-checkout-session`,
        {
          lessons,
          userId: user.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Stripe session response:', res.data);
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Checkout error:', err?.response?.data || err.message);
      alert('حدث خطأ أثناء محاولة الدفع');
    }
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl  transform overflow-hidden rounded-2xl bg-white p-4 md:p-6 text-left shadow-xl transition-all flex flex-col md:flex-row gap-4 md:gap-8">
                {/* Left: Date + Time */}
                <div className="w-full md:w-6/4 flex flex-col md:flex-row gap-4">
                  {/* Calendar */}
                  <div className="mb-4 md:mb-0 flex flex-col items-center justify-center h-full">
                    <h4 className="font-semibold text-gray-700 mb-2 text-center">Select Date</h4>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      inline
                      calendarClassName="rounded-lg"
                    />
                  </div>
                  {/* Time Slots with Scroll */}
                  <div className="flex-1 max-h-64 overflow-y-auto  pr-1">
                    <h4 className="font-semibold text-gray-700  mb-2 text-center md:text-left">Select Time</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {timeOptions.map((time) => {
                        const disabled = isTimeBooked(selectedDate, time);
                        const isSelected = selectedLessons.some((l) => l.includes(time));
                        return (
                          <button
                            key={time}
                            onClick={() => !disabled && handleTimeClick(time)}
                            disabled={disabled}
                            className={
                              `w-full py-2 px-0 rounded-full shadow text-base font-medium transition border border-gray-200 mb-2
                              ${disabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : isSelected
                                  ? "bg-blue-100 text-blue-700 border-blue-300"
                                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700"}
                            `
                            }
                            style={{ minWidth: "120px" }}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Selected Lessons */}
                <div className="w-full md:w-2/6 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold mb-2 text-center  md:text-left">Selected Lessons</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto  ">
                    {selectedLessons.length === 0 && (
                      <div className="text-gray-400 text-sm text-center">No lessons selected yet.</div>
                    )}
                    {selectedLessons.map((lesson, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-blue-200 p-3 rounded-lg text-base bg-blue-50 shadow-sm font-medium text-blue-900"
                      >
                        <span className="truncate ">{lesson}</span>
                        <button
                          onClick={() => setSelectedLessons(selectedLessons.filter((_, i) => i !== index))}
                          className="ml-2 text-gray-400  hover:text-red-500 transition text-xl font-bold"
                          title="Remove"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-auto"
                    onClick={handleCheckout}
                    disabled={selectedLessons.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
