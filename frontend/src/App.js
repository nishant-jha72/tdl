import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://tdl-0j04.onrender.com"; // Replace with your backend URL

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchDue, setSearchDue] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");

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
    if (!title.trim()) return;
    try {
      await axios.post(`${API_BASE}/tasks`, { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const completedAt = !task.completed ? new Date().toISOString() : null;
      await axios.put(`${API_BASE}/tasks/${task._id}`, { 
        completed: !task.completed, 
        completedAt 
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filterDue = tasks.filter(task =>
    !task.completed &&
    (task.title.toLowerCase().includes(searchDue.toLowerCase()) ||
     task.description?.toLowerCase().includes(searchDue.toLowerCase()))
  );

  const filterCompleted = tasks.filter(task =>
    task.completed &&
    (task.title.toLowerCase().includes(searchCompleted.toLowerCase()) ||
     task.description?.toLowerCase().includes(searchCompleted.toLowerCase()))
  );

  return (
    <div className="app-container">
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <h1>My To-Do List</h1>

      {/* Add Task Form */}
      <form className="add-task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Due Tasks Section */}
      <div className="task-section">
        <h2>Due Tasks</h2>
        <input
          type="text"
          placeholder="Search Due Tasks..."
          value={searchDue}
          onChange={(e) => setSearchDue(e.target.value)}
        />
        {filterDue.map(task => (
          <div key={task._id} className="task-card">
            <span>{task.title}</span>
            {task.description && <span className="task-desc">{task.description}</span>}
            <div className="task-actions">
              <button onClick={() => toggleComplete(task)}>Done</button>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks Section */}
      <div className="task-section">
        <h2>Completed Tasks</h2>
        <input
          type="text"
          placeholder="Search Completed Tasks..."
          value={searchCompleted}
          onChange={(e) => setSearchCompleted(e.target.value)}
        />
        {filterCompleted.map(task => (
          <div key={task._id} className="task-card completed">
            <span>{task.title}</span>
            {task.description && <span className="task-desc">{task.description}</span>}
            {task.completedAt && <span className="task-time">Completed: {new Date(task.completedAt).toLocaleString()}</span>}
            <div className="task-actions">
              <button onClick={() => toggleComplete(task)}>Undo</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
