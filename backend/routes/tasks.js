const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// ✅ Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// ✅ Add new task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description: description || "N/A" });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error adding task" });
  }
});

// ✅ Mark task as complete
router.put("/:id/complete", async (req, res) => {
  try {
    const { description } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true, completedAt: new Date(), description },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error marking task complete" });
  }
});

// ✅ Undo completed task
router.put("/:id/undo", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: false, completedAt: null },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error undoing task" });
  }
});

// ✅ Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
