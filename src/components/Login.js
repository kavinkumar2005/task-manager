import React, { useState } from "react";
import { auth, provider } from "../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import "./Login.css";

export default function Login() {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Google Sign-in
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("Google Login Failed: " + err.message);
    }
  };

  // ✅ Email/Password Auth
  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert("Authentication Error: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isSignup ? "Create Account" : "Welcome To TaskManager"}</h1>
        <p>{isSignup ? "Sign up to get started" : "Login to continue"}</p>

        <input
          type="email"
          placeholder="✉️ Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="🔒 Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p style={{ marginTop: "10px" }}>
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <span
            style={{ color: "#1565c0", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>

        <div className="divider">or sign in with</div>

        {/* ✅ Google Sign-in */}
        <button className="google-btn" onClick={googleLogin}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
