const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");
const Task = require("./models/Task");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Cron job: runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  try {
    const result = await Task.updateMany(
      { completed: true, updatedAt: { $lte: sixDaysAgo } },
      { completed: false }
    );
    if (result.modifiedCount > 0) {
      console.log(`🔄 Reset ${result.modifiedCount} tasks to Due Tasks`);
    }
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});

// Routes
const tasksRoute = require("./routes/tasks");
app.use("/tasks", tasksRoute);

// Default route
app.get("/", (req, res) => res.send("🚀 Backend is running!"));
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build files
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
