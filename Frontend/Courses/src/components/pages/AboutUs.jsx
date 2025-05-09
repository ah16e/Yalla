import React from "react";
import Img from "../../assets/6.png"    
import Img1 from "../../assets/7.png"    
import Img2 from "../../assets/8.png"    

export default function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4 md:px-8">
      {/* Section 1 */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Achieve fluency with lessons tailored<br />
            to your specific goals and needs.
          </h2>
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
        <img
          src={Img1}
          alt="Section 1"
          className="w-48 sm:w-60 md:w-72 max-w-full mx-auto"
        />
      </div>
      {/* Section 2 */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Achieve fluency with lessons tailored<br />
            to your specific goals and needs.
          </h2>
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
        <img
          src={Img}
          alt="Section 2"
          className="w-48 sm:w-60 md:w-72 max-w-full mx-auto"
        />
      </div>
      {/* Section 3 */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8">
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Achieve fluency with lessons tailored<br />
            to your specific goals and needs.
          </h2>
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
        <img
          src={Img2}
          alt="Section 3"
          className="w-48 sm:w-60 md:w-72 max-w-full mx-auto"
        />
      </div>
    </div>
  );
} 