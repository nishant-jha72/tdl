const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// ✅ Import routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", tasks);

// ✅ CRON job: move tasks to "due" after 6 days
const Task = require("./models/Task");
cron.schedule("0 0 * * *", async () => {
  const today = new Date();
  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(today.getDate() - 6);

  await Task.updateMany(
    { status: "pending", createdAt: { $lte: sixDaysAgo } },
    { status: "due" }
  );
  console.log("⏰ Updated due tasks successfully!");
});

// ✅ Serve React frontend build
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
