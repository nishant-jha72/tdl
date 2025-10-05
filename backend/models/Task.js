const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "na" },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null }, // 🆕 Added
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
