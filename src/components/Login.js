import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "./Login.css";

export default function Login() {
  // ✅ Handle Google Login
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚀 Welcome to Task Manager</h1>
        <p>Organize your tasks with ease. Sign in to continue!</p>
        <button className="login-btn" onClick={signIn}>
          🔑 Sign in with Google
        </button>
      </div>
    </div>
  );
}
