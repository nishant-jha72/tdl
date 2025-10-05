import React from "react";

function TaskList({ tasks, onComplete, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className={task.completed ? "completed" : ""}>
          <div className="task-title">{task.title}</div>
          {task.completed && <div className="task-desc">Description: {task.description}</div>}
          <div className="task-buttons">
            {!task.completed && <button onClick={() => onComplete(task._id)}>Complete</button>}
            <button onClick={() => onDelete(task._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
