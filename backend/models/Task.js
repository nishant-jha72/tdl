const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: "N/A", // if no description is added
  },
});

module.exports = mongoose.model("Task", taskSchema);
