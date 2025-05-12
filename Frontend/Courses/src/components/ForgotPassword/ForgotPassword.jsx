import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/forgot-password`, { email });
      toast.success("Password reset link sent! Check your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending reset link");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border px-3 py-2 rounded mb-4"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
} 