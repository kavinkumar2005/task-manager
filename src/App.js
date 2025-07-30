import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import TaskManager from "./components/TaskManager";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsub;
  }, []);

  return (
    <div className="App">
      <h1>🔥 Task Manager with Firebase</h1>
      <Login user={user} setUser={setUser} />
      {user && <TaskManager user={user} />}
    </div>
  );
}

export default App;
