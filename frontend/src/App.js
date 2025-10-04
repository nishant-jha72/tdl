import React, { useState, useEffect } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  // 🔹 Modified toggleComplete function
  const toggleComplete = async (id, currentStatus) => {
    try {
      let description = "N/A";

      // Ask only when marking as completed
      if (!currentStatus) {
        description = prompt("Add a description for this completed task:", "");
        if (!description || description.trim() === "") description = "N/A";
      }

      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus, description }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const workTodo = tasks.filter((task) => !task.completed);
  const workDone = tasks.filter((task) => task.completed);

  return (
    <div className="container">
      <h1 className="title">📝 RUMMMY KA KAAM</h1>
      <AddTaskForm addTask={addTask} />

      <div className="task-grid">
        <div className="task-section">
          <h2>⏳ Due Tasks</h2>
          <TaskList
            tasks={workTodo}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
          />
        </div>

        <div className="task-section completed-section">
          <h2>✅ Completed Tasks</h2>
          <TaskList
            tasks={workDone}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
