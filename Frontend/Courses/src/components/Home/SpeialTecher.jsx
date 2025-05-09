import React, { useContext } from 'react'
import { TeacherContext } from '../../contexts/Teacher';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from "swiper/modules";
import { useNavigate } from 'react-router-dom';


export default function SpeialTecher() {

  const {teachers , loading } = useContext(TeacherContext);
  const navigat = useNavigate();

  if(loading) return <h1>Loading...</h1>
  return (
    <div className="px-4 py-8">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800">Get to know our teachers</h2>
    </div>

    <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
        }}
        className="pb-8"
    >
      {teachers.map((item) => (
        <SwiperSlide key={item._id}>
          <div className="bg-white rounded-2xl  overflow-hidden transition  ">
            <div className="relative flex justify-center rounded-lg  items-center py-4">
              <img
                src={item.image || "https://via.placeholder.com/120x120"}
                alt="teacher"
                className="w-64 h-64 rounded-xl  object-cover border-2 border-blue-200 shadow-sm"
              />
            </div>

            <div className="p-4 flex flex-col items-center text-center">
              <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
              <p className="text-sm text-gray-500 mb-1">Professional Teacher</p>
              <p className="text-sm text-gray-600 mb-2">
                Speak: <span className="text-blue-600 font-medium">Arabic</span>,{" "}
                <span className="text-blue-600 font-medium">English</span>
              </p>
              <p className="text-md text-gray-700 mb-2">
                Lesson start from <span className="text-black font-bold">{item.price} $</span>
              </p>
              <button onClick={() => navigat(`/teacher/${item._id}`)} className="bg-blue-600 text-white w-full py-2 rounded-lg mt-2 hover:bg-blue-700 transition">
                Book Session Now →
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>

  
  );
}
