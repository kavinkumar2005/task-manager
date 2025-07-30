import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import "./TaskManager.css";  // custom styles

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // ✅ Fetch tasks for logged-in user
  useEffect(() => {
    if (!user) return;
    const taskRef = collection(db, "tasks");
    const q = query(taskRef, where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [user]);

  // ✅ Add task
  const addTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      text: newTask,
      createdAt: new Date()
    });
    setNewTask("");
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="task-container">
      <h2>📝 Task Manager</h2>

      <div className="task-input-box">
        <input
          type="text"
          placeholder="✨ Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>➕ Add</button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty">🎉 No tasks yet! Start by adding one.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className="task-item">
              <span>{t.text}</span>
              <button className="delete" onClick={() => deleteTask(t.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
