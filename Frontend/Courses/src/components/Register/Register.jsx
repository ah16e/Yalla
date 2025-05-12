import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function SignupPage() {
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
      console.log("Form data:", data); // Log the form data
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/register`, data);
      const { token, user } = res.data.data;
      login({ token, ...user }); // Save user in context + localStorage
      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/");
      }, 1200); // 1.2 seconds delay
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.data?.message?.toLowerCase().includes("already exists") || err.response?.status === 409) {
        toast.error("Account already exists. Please sign in or use another email.");
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <div className="mb-6">
          <h1 className="font-bold text-xl mb-1">Yalla</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sign up to access the Yalla Course and enjoy.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name")}
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 mb-2 rounded-full bg-gray-100 focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name.message}</p>}

          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 mb-2 rounded-full bg-gray-100 focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email.message}</p>}

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
          {errors.password && <p className="text-red-500 text-xs mb-4">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-full text-sm hover:opacity-90 transition mb-4"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline text-gray-700 hover:text-black">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
