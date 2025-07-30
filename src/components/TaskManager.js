import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [file, setFile] = useState(null);

  const taskRef = collection(db, "tasks");

  useEffect(() => {
    if (!user) return;
    const q = query(taskRef, where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [user]);

  const addTask = async () => {
    if (!newTask.trim()) return;
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

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="task-manager">
      <h2>📌 Your Tasks</h2>
      <div className="task-input">
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter task..." />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={addTask}>➕ Add Task</button>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.text} 
            {t.fileUrl && <a href={t.fileUrl} target="_blank" rel="noreferrer">📎 Attachment</a>}
            <button onClick={() => deleteTask(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
