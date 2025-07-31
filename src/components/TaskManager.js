import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import "./TaskManager.css";

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (!user) return;
    const taskRef = collection(db, "tasks");
    const q = query(taskRef, where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  // ✅ Add task
  const addTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      text: newTask,
      createdAt: new Date(),
      completed: false,
      completedAt: null
    });
    setNewTask("");
  };

  // ✅ Toggle task completion
  const toggleTask = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, {
      completed: !task.completed,
      completedAt: task.completed ? null : new Date()
    });
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="task-container">
      <h2>📝 Your Tasks</h2>

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
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  color: t.completed ? "#999" : "#333",
                  cursor: "pointer"
                }}
                onClick={() => toggleTask(t)}
              >
                {t.text} {t.completed && ` ✅ (Done on ${new Date(t.completedAt?.seconds * 1000).toLocaleDateString()})`}
              </span>
              <button className="delete" onClick={() => deleteTask(t.id)}>
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
