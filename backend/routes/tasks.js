const express = require("express");
const router = express.Router();
const taskRoutes = require("./routes/tasks");


// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// Add new task
router.post("/", async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title });
  await task.save();
  res.json(task);
});

// Mark task completed
router.put("/:id/complete", async (req, res) => {
  const { description } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  task.completed = true;
  task.description = description || "na";
  await task.save();
  res.json(task);
});

// Delete task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Task deleted" });
});
// UNDO TASK
// Undo completed task
router.put("/:id/undo", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  task.completed = false;
  await task.save();
  res.json(task);
});
// Complete task
router.put("/:id/complete", async (req, res) => {
  const { description } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  task.completed = true;
  task.description = description || "na";
  task.completedAt = new Date(); // 🆕 Store current date
  await task.save();
  res.json(task);
});



module.exports = router;
