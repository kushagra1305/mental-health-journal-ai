import { useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/signup", { name, email, password });
      alert("Registration successful ✅ Please login.");
      window.location.href = "/"; // redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-emerald-700 relative overflow-hidden">
      {/* glow background */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-400/30 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/80 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/40"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Start your safe mental wellness journey 🌿
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/")}
            className="text-emerald-600 font-medium cursor-pointer"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
