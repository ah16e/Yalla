import { Mail, Phone, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-10 px-6 text-sm text-gray-600">
      {/* Top Heading Centered */}
      <div className="text-center mb-10">
        <h1 className="text-base md:text-lg font-semibold text-gray-700">
          H About · Find your teacher · FAQ · Reviews · Contact Us
        </h1>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Contact Information</h3>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Phone className="w-4 h-4" />
            <span>+972 54-648-7767</span>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
            <Mail className="w-4 h-4 text-red-500" />
            <a href="mailto:eteachermode@gmail.com" className="hover:underline">
              eteachermode@gmail.com
            </a>
          </div>
          <div className="mt-4">
            <p className="font-medium mb-1 text-gray-800">Follow us on social media</p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#" className="hover:opacity-75"><Facebook /></a>
              <a href="#" className="hover:opacity-75"><Instagram /></a>
              <div className="w-6 h-6 rounded-full bg-black" /> {/* Placeholder for 3rd icon */}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Home</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline text-gray-800 font-semibold">About Us</a></li>
            <li><a href="#" className="hover:underline text-gray-800 font-semibold">Find your teacher</a></li>
            <li><a href="#" className="hover:underline text-gray-800 font-semibold">FAQ</a></li>
            <li><a href="#" className="hover:underline text-gray-800 font-semibold">Reviews</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Policies</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Terms and Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-10 text-center text-xs text-gray-500">
        © 2024 Yalla. All rights reserved.
      </div>
    </footer>
  );
}
