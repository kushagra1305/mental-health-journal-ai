const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes import
const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");
const aiRoutes = require("./routes/ai");   // ← ADD

// Routes use
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/ai", aiRoutes);              // ← ADD

// Test route
app.get("/", (req, res) => {
  res.send("Mental Health AI API running...");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
