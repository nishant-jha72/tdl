import React, { useEffect, useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchDue, setSearchDue] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    const res = await fetch("https://tdl-0j04.onrender.com/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title) => {
    await fetch("https://tdl-0j04.onrender.com/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    fetchTasks();
  };

  const completeTask = async (id) => {
    const description = prompt("Enter a description (or leave blank for 'na')") || "na";
    await fetch(`https://tdl-0j04.onrender.com/tasks/${id}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    fetchTasks();
  };

  const undoTask = async (id) => {
    await fetch(`https://tdl-0j04.onrender.com/tasks/${id}/undo`, {
      method: "PUT",
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`https://tdl-0j04.onrender.com/tasks/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const dueTasks = tasks
    .filter((t) => !t.completed)
    .filter((t) => t.title.toLowerCase().includes(searchDue.toLowerCase()));

  const completedTasks = tasks
    .filter((t) => t.completed)
    .filter((t) => t.title.toLowerCase().includes(searchCompleted.toLowerCase()));

  return (
    <div className="app-container">
      <h1>📝 Task Manager</h1>

      <AddTaskForm onAdd={addTask} />

      <div className="task-sections">
        {/* DUE TASKS */}
        <div className="task-section due-tasks">
          <h2>Due Tasks</h2>
          <input
            type="text"
            placeholder="Search due tasks..."
            value={searchDue}
            onChange={(e) => setSearchDue(e.target.value)}
            className="search-box"
          />
          <TaskList
            tasks={dueTasks}
            onComplete={completeTask}
            onDelete={deleteTask}
            onUndo={undoTask}
          />
        </div>

        {/* COMPLETED TASKS */}
        <div className="task-section completed-tasks">
          <h2>Completed Tasks</h2>
          <input
            type="text"
            placeholder="Search completed tasks..."
            value={searchCompleted}
            onChange={(e) => setSearchCompleted(e.target.value)}
            className="search-box"
          />
          <TaskList
            tasks={completedTasks}
            onComplete={completeTask}
            onDelete={deleteTask}
            onUndo={undoTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
