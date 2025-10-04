import React, { useState } from 'react';

function AddTaskForm({ addTask }) {
  const [taskName, setTaskName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: taskName, completed: false }),
    });

    const data = await response.json();
    addTask(data);
    setTaskName('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add new task..."
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTaskForm;
