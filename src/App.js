import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask }]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="app">
      <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>

      <div className="container">
        <h1>🌈 My Task Manager</h1>

        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="✍️ Type your task..."
          />
          <button onClick={addTask}><FaPlus /></button>
        </div>

        <ul className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">✨ No tasks yet. Start adding!</p>
          ) : (
            tasks.map(task => (
              <li key={task.id} className="task-item">
                <span>{task.text}</span>
                <button className="delete" onClick={() => deleteTask(task.id)}>
                  <FaTrash />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
