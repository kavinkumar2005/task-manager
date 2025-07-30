import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask }]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="container">
      <h1>✅ My Task Manager</h1>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="✍️ Add a new task..."
        />
        <button onClick={addTask}>➕ Add</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p className="empty">🎉 No tasks yet. Add one above!</p>
        ) : (
          tasks.map(task => (
            <li key={task.id} className="task-item">
              <span>{task.text}</span>
              <button className="delete" onClick={() => deleteTask(task.id)}>❌</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
