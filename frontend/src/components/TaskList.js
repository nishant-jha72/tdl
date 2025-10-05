import React from "react";
import "./TaskList.css";

function TaskList({ title, tasks, onComplete, onUndo, onDelete }) {
  return (
    <div className="tasklist">
      <h2>{title}</h2>
      {tasks.length === 0 ? (
        <p className="empty">No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              className={task.completed ? "completed" : "due"}
            >
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                {task.completed && task.completedAt && (
                  <small>
                    ✅ Completed on:{" "}
                    {new Date(task.completedAt).toLocaleDateString()}
                  </small>
                )}
              </div>

              <div className="task-buttons">
                {!task.completed && (
                  <button onClick={() => onComplete(task._id)}>Complete</button>
                )}
                {task.completed && (
                  <button onClick={() => onUndo(task._id)}>Undo</button>
                )}
                <button onClick={() => onDelete(task._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
