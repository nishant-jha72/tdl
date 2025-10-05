const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "na" },
  completed: { type: Boolean, default: false },
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model("Task", TaskSchema);
