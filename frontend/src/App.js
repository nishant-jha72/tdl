import React, { useEffect, useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    const res = await fetch("https://tdl-0j04.onrender.com/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async (title) => {
    const res = await fetch("https://tdl-0j04.onrender.com/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    setTasks([...tasks, data]);
  };

  // Mark task completed
  const completeTask = async (id) => {
    const description = prompt("Add a description for this task:", "na") || "na";
    const res = await fetch(`https://tdl-0j04.onrender.com/tasks/${id}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    const data = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? data : t)));
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`https://tdl-0j04.onrender.com/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const dueTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="app">
      <div className="background-video">
        <video autoPlay loop muted>
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container">
        <h1>My Todo App</h1>
        <AddTaskForm addTask={addTask} />

        <div className="task-sections">
          <div className="tasks-due">
            <h2>Due Tasks</h2>
            <TaskList
              tasks={dueTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          </div>

          <div className="tasks-completed">
            <h2>Completed Tasks</h2>
            <TaskList
              tasks={completedTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
