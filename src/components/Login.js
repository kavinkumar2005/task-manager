import React from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login({ user, setUser }) {
  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const logout = () => signOut(auth);

  return (
    <div className="login">
      {user ? (
        <>
          <p>👋 Welcome, {user.displayName}</p>
          <button onClick={logout}>🚪 Sign Out</button>
        </>
      ) : (
        <button onClick={login}>🔐 Sign in with Google</button>
      )}
    </div>
  );
}
