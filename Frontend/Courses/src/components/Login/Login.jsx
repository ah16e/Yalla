import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/users/login", data);
      const { token, user } = res.data.data;
      login({ token, ...user });
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <div className="mb-6">
          <h1 className="font-bold text-xl mb-1">Yalla</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Welcome to Yalla course. Please login below to access all the course content.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 mb-2 rounded-full bg-gray-100 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-2">{errors.email.message}</p>
          )}

          <div className="relative mb-2">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 pr-10 rounded-full bg-gray-100 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mb-4">{errors.password.message}</p>
          )}

          <div className="flex gap-4 mb-4">
            <NavLink
              to="/forgot-password"
              className="w-1/2 bg-gray-700 text-white py-2 rounded-full text-sm text-center flex items-center justify-center"
            >
              Forgot Password?
            </NavLink>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-blue-500 text-white py-2 rounded-full text-sm hover:opacity-90 transition"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 text-sm">
          <NavLink to="/register" className="underline text-gray-700 hover:text-black">
            Don't have an account? Sign up here
          </NavLink>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}
