import React from "react";
import Img9 from "../../assets/9.png"
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    text: "I came to learn that the storyline in my head ... was holding me back.",
    name: "Peter, Belgium",
    subtitle: "Beginner Learner"
  },
  {
    text: "Headspace provides me with ... a connection to myself, and a disconnection from negative thoughts, feelings, and sensations.",
    name: "Karl, UK",
    subtitle: "Beginner Learner",
    highlight: true
  },
  {
    text: "Changing my thoughts has allowed me to change my life.",
    name: "Elavdey, London",
    subtitle: "Intermediate Learner"
  },
];

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-2 sm:px-4 md:px-8">
      {/* Testimonials Section */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Our learners, Our Success</h2>
      <div className="flex flex-wrap justify-center gap-6 mb-16">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`rounded-3xl px-6 py-8 w-72 min-h-[180px] flex flex-col justify-between items-center text-center shadow-sm ${t.highlight ? 'bg-blue-50 text-blue-900 shadow-lg' : 'bg-gray-50 text-gray-500'}`}
          >
            <FaQuoteLeft className="text-4xl mb-2 text-blue-500" />
            <p className="mb-4 text-base font-medium">{t.text}</p>
            <div className="mt-auto">
              <p className="text-xs font-semibold">{t.name}</p>
              <p className="text-[10px] italic">{t.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Section */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">The Impact We've Made <span className="font-normal">Becky Nelson</span></h2>
      <div className="flex flex-col md:flex-row items-center justify-center relative">
        <img
          src={Img9}
          alt="Whatsapp Chat"
          className="w-96 h-96 rounded-xl mb-6 md:mb-0 z-10"
        />
        {/* Stacked cards effect */}
        <div className="relative w-full max-w-md flex items-center justify-center">
          <div className="absolute left-4 top-4 w-full h-full bg-white rounded-xl shadow-lg opacity-60 scale-95 z-0"></div>
          <div className="absolute left-8 top-8 w-full h-full bg-white rounded-xl shadow-lg opacity-40 scale-90 z-0"></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full z-10">
            <p className="text-gray-700 mb-2">
              Ask agreed answer rather joy nature admire wisdom. Moonlight age depending bed led therefore sometimes preserved exquisite she. An fall up so shot leaf wise in. Minuter highest his arrived for put and. Hopes lived by rooms oh in no death house.
            </p>
          </div>
          {/* Arrow */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-4xl text-gray-300 select-none hidden md:block">
            &gt;
          </div>
        </div>
      </div>
    </div>
  );
} 