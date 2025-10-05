import React, { useEffect, useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
// import "./App.css";

const API_BASE = "https://tdl-0j04.onrender.com"; // your backend URL

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchDue, setSearchDue] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");

  // ✅ Fetch all tasks
  const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add new task
  const addTask = async (title, description) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    setTasks([data, ...tasks]);
  };

  // ✅ Mark task as completed
  const completeTask = async (id) => {
    const description = prompt("Enter a completion note:", "N/A");
    const res = await fetch(`${API_BASE}/tasks/${id}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    const data = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? data : t)));
  };

  // ✅ Undo completed task
  const undoTask = async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/undo`, { method: "PUT" });
    const data = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? data : t)));
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // ✅ Filter tasks
  const dueTasks = tasks.filter(
    (t) => !t.completed && t.title.toLowerCase().includes(searchDue.toLowerCase())
  );
  const completedTasks = tasks.filter(
    (t) => t.completed && t.title.toLowerCase().includes(searchCompleted.toLowerCase())
  );

  return (
    <div className="App">
      <div className="header">
        <h1>📝 Smart Task Manager</h1>
      </div>

      <AddTaskForm onAdd={addTask} />

      <div className="search-section">
        <div>
          <h2>Due Tasks</h2>
          <input
            type="text"
            placeholder="Search Due Tasks..."
            value={searchDue}
            onChange={(e) => setSearchDue(e.target.value)}
          />
        </div>
        <div>
          <h2>Completed Tasks</h2>
          <input
            type="text"
            placeholder="Search Completed Tasks..."
            value={searchCompleted}
            onChange={(e) => setSearchCompleted(e.target.value)}
          />
        </div>
      </div>

      <div className="tasks-container">
        <div className="task-section due">
          <TaskList
            title="Due Tasks"
            tasks={dueTasks}
            onComplete={completeTask}
            onDelete={deleteTask}
          />
        </div>

        <div className="task-section completed">
          <TaskList
            title="Completed Tasks"
            tasks={completedTasks}
            onUndo={undoTask}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
