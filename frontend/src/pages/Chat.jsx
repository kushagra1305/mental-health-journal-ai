import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const bottomRef = useRef(null);

  // Load history
  const loadHistory = async () => {
    try {
      const res = await API.get("/ai/chat");

      const formatted = res.data.flatMap((c) => [
        { sender: "user", text: c.message },
        { sender: "ai", text: c.reply },
      ]);

      setChat(formatted);
    } catch (err) {
      console.log("Failed to load history");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await API.post("/ai/chat", { message });

      const aiMsg = { sender: "ai", text: res.data.reply };
      setChat((prev) => [...prev, aiMsg]);
    } catch (err) {
      alert("AI error");
    }

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-emerald-800 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 text-lg font-semibold">
        AI Mental Health Chat 💬
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto space-y-4">
        {chat.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-2xl max-w-[75%] shadow ${
              m.sender === "user"
                ? "bg-emerald-500 text-white ml-auto"
                : "bg-white/10 backdrop-blur-md border border-white/10 text-white"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl px-4 py-3 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-emerald-500 hover:bg-emerald-600 px-6 rounded-xl font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
