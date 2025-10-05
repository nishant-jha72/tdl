const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const tasksRoute = require("./routes/tasks");
const Task = require("./models/Task");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", tasksRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Auto-reopen completed tasks after 6 days
const reopenTasks = async () => {
  try {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    await Task.updateMany(
      { completed: true, completedAt: { $lt: sixDaysAgo } },
      { completed: false, completedAt: null, description: "" }
    );
    console.log("Reopened tasks older than 6 days");
  } catch (err) {
    console.error(err);
  }
};

// Run every 24 hours
setInterval(reopenTasks, 24 * 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
