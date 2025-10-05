import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://tdl-0j04.onrender.com"; // replace with your backend

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
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
      await axios.post(`${API_BASE}/tasks`, { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const completedAt = !task.completed ? new Date().toISOString() : null;
      await axios.put(`${API_BASE}/tasks/${task._id}`, { 
        completed: !task.completed, completedAt 
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateDescription = async (task, desc) => {
    try {
      await axios.put(`${API_BASE}/tasks/${task._id}`, { description: desc });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const dueTasks = tasks.filter(t => !t.completed && t.title.toLowerCase().includes(searchDue.toLowerCase()));
  const completedTasks = tasks.filter(t => t.completed && t.title.toLowerCase().includes(searchCompleted.toLowerCase()));

  return (
    <div className="app-container">
      {/* Background Video */}
      <video className="background-video" autoPlay loop muted>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <h1>My To-Do List</h1>

      <form className="add-task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="tasks-container">
        {/* Due Tasks */}
        <div className="task-section">
          <h2>Due Tasks</h2>
          <input
            placeholder="Search Due Tasks..."
            value={searchDue}
            onChange={e => setSearchDue(e.target.value)}
          />
          {dueTasks.map(task => (
            <div key={task._id} className="task-card">
              <span>{task.title}</span>
              <div className="task-actions">
                <button onClick={() => toggleComplete(task)}>Done</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Tasks */}
        <div className="task-section">
          <h2>Completed Tasks</h2>
          <input
            placeholder="Search Completed Tasks..."
            value={searchCompleted}
            onChange={e => setSearchCompleted(e.target.value)}
          />
          {completedTasks.map(task => (
            <div key={task._id} className="task-card completed">
              <span>{task.title}</span>
              <textarea
                value={task.description || ""}
                onChange={(e) => updateDescription(task, e.target.value)}
              />
              {task.completedAt && (
                <span className="task-time">
                  Completed: {new Date(task.completedAt).toLocaleDateString()}
                </span>
              )}
              <div className="task-actions">
                <button onClick={() => toggleComplete(task)}>Undo</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
