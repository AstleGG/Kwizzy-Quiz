import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { auth, provider, signInWithPopup, onAuthStateChanged } from "./firebase";

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Logged in as " + auth.currentUser?.displayName);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Kwizzy Quiz</h1>
      {!user && <button onClick={loginWithGoogle}>Log in with Google</button>}
      {user && (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={() => alert("Score saved!")}>Save Score</button>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
