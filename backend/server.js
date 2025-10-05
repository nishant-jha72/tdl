const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const path = require("path");
const Task = require("./models/Task");
const taskRoutes = require("./routes/tasks");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Cron job: runs daily, reverts tasks completed > 6 days ago
cron.schedule("0 0 * * *", async () => {
  try {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const result = await Task.updateMany(
      { completed: true, completedAt: { $lte: sixDaysAgo } },
      { $set: { completed: false, completedAt: null } }
    );
    if (result.modifiedCount > 0) {
      console.log(`🔄 ${result.modifiedCount} tasks moved back to due`);
    }
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});

// ✅ Serve frontend build on Render
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
