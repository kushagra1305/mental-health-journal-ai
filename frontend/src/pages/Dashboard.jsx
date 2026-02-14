import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("happy");
  const [journals, setJournals] = useState([]);

  // fetch journals
  const fetchJournals = async () => {
    try {
      const res = await API.get("/journal");
      setJournals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  // create journal
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/journal", { text, mood });
      setText("");
      fetchJournals();
    } catch (err) {
      alert("Failed to add journal");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const openChat = () => {
    window.location.href = "/chat";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-emerald-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h1 className="text-2xl font-semibold">Your Safe Space 🌿</h1>

        <div className="flex gap-3">
          <button
            onClick={openChat}
            className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg font-medium transition"
          >
            💬 AI Chat
          </button>

          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Journal Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>

          <textarea
            placeholder="Write your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
            className="w-full rounded-xl p-3 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="rounded-xl px-3 py-2 bg-white text-gray-800 focus:outline-none"
            >
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="anxious">😟 Anxious</option>
              <option value="calm">😌 Calm</option>
            </select>

            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-xl font-medium transition"
            >
              Add Entry
            </button>
          </div>
        </motion.form>

        {/* Journal List */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-white/90">Your Journals</h3>

          {journals.length === 0 && (
            <p className="text-white/60">No journal entries yet. Start writing ✨</p>
          )}

          {journals.map((j) => (
            <motion.div
              key={j._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow"
            >
              <div className="flex justify-between items-center">
                <span className="capitalize font-semibold text-emerald-300">
                  {j.mood}
                </span>
              </div>

              <p className="mt-2 text-white/90">{j.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
