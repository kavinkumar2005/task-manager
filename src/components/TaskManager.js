import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [file, setFile] = useState(null);

  // ✅ Fetch tasks in real-time for the logged-in user
  useEffect(() => {
    if (!user) return;

    const taskRef = collection(db, "tasks"); // define inside
    const q = query(taskRef, where("uid", "==", user.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub; // cleanup on unmount
  }, [user]);

  // ✅ Add new task (with optional file upload)
  const addTask = async () => {
    if (!newTask.trim()) return;

    const taskRef = collection(db, "tasks"); // define where needed
    let fileUrl = "";

    if (file) {
      const fileRef = ref(storage, `uploads/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }

    await addDoc(taskRef, {
      uid: user.uid,
      text: newTask,
      fileUrl,
      createdAt: new Date()
    });

    setNewTask("");
    setFile(null);
  };

  // ✅ Delete a task by ID
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="task-manager">
      <h2>📌 Your Tasks</h2>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={addTask}>➕ Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p className="empty">✨ No tasks yet. Start adding!</p>
        ) : (
          tasks.map((t) => (
            <li key={t.id} className="task-item">
              <span>{t.text}</span>
              {t.fileUrl && (
                <a href={t.fileUrl} target="_blank" rel="noreferrer">
                  📎 View Attachment
                </a>
              )}
              <button className="delete" onClick={() => deleteTask(t.id)}>
                ❌
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
