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
  updateDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import "./TaskManager.css";

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // ✅ Fetch tasks (Real-time listener)
  useEffect(() => {
    if (!user) return;

    const taskRef = collection(db, "tasks");
    const q = query(taskRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      text: newTask,
      createdAt: serverTimestamp(), // ✅ use Firestore timestamp
      completed: false,
      completedAt: null
    });
    setNewTask("");
  };

  // ✅ Toggle completion
  const toggleTaskCompletion = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    const isCompleted = !task.completed;
    await updateDoc(taskRef, {
      completed: isCompleted,
      completedAt: isCompleted ? serverTimestamp() : null
    });
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="task-container">
      <h2>📝 Your Tasks</h2>

      {/* Task Input */}
      <div className="task-input-box">
        <input
          type="text"
          placeholder="✨ Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>➕ Add</button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="empty">🎉 No tasks yet! Start by adding one.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className="task-item">
              <span
                onClick={() => toggleTaskCompletion(t)}
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  color: t.completed ? "#888" : "#333",
                  cursor: "pointer"
                }}
              >
                {t.text}{" "}
                {t.completed && t.completedAt && (
                  <em style={{ fontSize: "12px", color: "#1565c0" }}>
                    (Done on {t.completedAt.toDate().toLocaleDateString()})
                  </em>
                )}
              </span>
              <button className="delete" onClick={() => deleteTask(t.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
