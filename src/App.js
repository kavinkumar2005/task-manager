import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import TaskManager from "./components/TaskManager";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Track user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="app-wrapper">
      {user ? (
        <>
          <header className="app-header">
            <h1>🔥 Task Manager</h1>
            <button className="logout-btn" onClick={() => signOut(auth)}>🚪 Logout</button>
          </header>
          <TaskManager user={user} />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
