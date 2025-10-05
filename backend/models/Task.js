const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  description: { type: String, default: "N/A" },
});

module.exports = mongoose.model("Task", taskSchema);
