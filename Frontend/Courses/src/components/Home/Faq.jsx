import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "What is Webflow and why is it the best website builder?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    question: "What is your favorite template from BRIX Templates?",
    answer:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "How do you clone a Webflow Template from the Showcase?",
    answer:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Why is BRIX Templates the best Webflow agency out there?",
    answer:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-2xl mx-auto pb-8  px-4 text-center">
      <h2 className="text-2xl font-bold mb-10  text-gray-800">FAQ</h2>
      <div className="flex flex-col gap-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 border ${
              openIndex === index ? "border-blue-500 bg-white shadow-md" : "bg-gray-50"
            } text-left transition-all duration-300`}
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex justify-between  items-center px-6 py-4 font-medium text-gray-800 focus:outline-none"
            >
              {item.question}
              {openIndex === index ? (
                <ChevronDown className="text-blue-500" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-8 pb-4 text-sm text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="mt-6 text-sm text-gray-500 underline hover:text-gray-700">
        See More
      </button>
    </div>
  );
}
