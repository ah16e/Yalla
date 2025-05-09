import React from 'react'
import Yalla from '../../assets/2.png'
import png3 from '../../assets/3.png'
import png4 from '../../assets/4.png'
import png5 from '../../assets/5.png'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  
  const handleStartNow = () => {
    if (!user) {
      navigate("/login");
    } else {
      // Scroll to teachers section
      const teachersSection = document.getElementById("teachers-section");
      if (teachersSection) {
        teachersSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-gradient-to-r  to-blue-800 text-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* النص الرئيسي */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl xs:text-4xl text-black sm:text-5xl font-bold mb-6 leading-tight">
            Become fluent in Arabic With<span className="text-blue-400">Yalla</span>
          </h1>
          
          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-base sm:text-lg">
            <li className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className='text-black'>Start speaking Arabic with confidence in no time</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className='text-black'>Gain confidence with expert guidance and real-world practice</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className='text-black'>Find joy in learning with supportive and skilled instructors</span>
            </li>
          </ul>
          
          <button
      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
      onClick={handleStartNow}
    >
      Start Now
    </button>
        </div>
        
        {/* صورة أو عنصر مرئي */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
          <div className="bg-white/20 rounded-xl p-2 sm:p-4 backdrop-blur-sm w-full max-w-md">
            {/* استبدل هذا العنصر بصورة حقيقية */}
            <div className="w-full aspect-video bg-transparent rounded-lg flex items-center justify-center">
              <img src={Yalla} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center"> 
          {/* تكرار الرسالة ثلاث مرات مع أنماط مختلفة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {/* البطاقة الأولى */}
            <div className="p-6 md:p-8 lg:p-10">
              <div className="text-blue-600">
              <img src={png3} alt="" />
              </div>
              <p className=" text-gray-700 font-medium">
                Achieve fluency with lessons tailored to your specific goals and needs.
              </p>
            </div>
            
            {/* البطاقة الثانية */}
            <div className="p-6 md:p-8 lg:p-10">
              <div className="text-blue-700 ">
               <img src={png4} alt="" />
              </div>
              <p className=" text-gray-700 font-medium">
                Achieve fluency with lessons tailored to your specific goals and needs.
              </p>
            </div>
            
            {/* البطاقة الثالثة */}
            <div className="p-6 md:p-8 lg:p-10 ">
              <div className="text-blue-600">
              <img src={png5} alt="" />
              </div>
              <p className=" text-gray-700 font-medium">
                Achieve fluency with lessons tailored to your specific goals and needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
