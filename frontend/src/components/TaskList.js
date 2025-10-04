import React from "react";

function TaskList({ tasks, toggleComplete, deleteTask }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task._id}
          className={`task-item ${task.completed ? "done" : ""}`}
        >
          <div>
            <strong>{task.name}</strong>

            {/* Show description only for completed tasks */}
            {task.completed && task.description && (
              <p className="description">📝 {task.description}</p>
            )}
          </div>

          <div>
            <button
              className="complete-btn"
              onClick={() => toggleComplete(task._id, task.completed)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              className="delete-btn"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
