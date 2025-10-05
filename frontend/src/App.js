import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://tdl-0j04.onrender.com"; // replace with your backend URL

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post(`${API_BASE}/tasks`, { title: newTask });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_BASE}/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <h1>My To-Do List</h1>

      <form className="add-task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`task-card ${task.completed ? "completed" : ""}`}
          >
            <span>{task.title}</span>
            <div className="task-actions">
              <button onClick={() => toggleComplete(task)}>
                {task.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
