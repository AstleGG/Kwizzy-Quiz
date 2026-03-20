import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from "./firebase";

function App() {
  const [user, setUser] = useState<any>(null);

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Google login function
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in as " + auth.currentUser?.displayName);
    } catch (err: any) {
      alert("Login error: " + err.message);
    }
  };

  // Logout function (optional)
  const logout = async () => {
    await signOut(auth);
    alert("Logged out!");
  };

  // Save score (example)
  const saveScore = async () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }
    alert(`Score saved for ${user.displayName}`);
    // You can later use Firestore here:
    // await addDoc(collection(db, "scores"), { userId: user.uid, score: 123, timestamp: serverTimestamp() });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Kwizzy Quiz</h1>

      {!user && (
        <button onClick={loginWithGoogle}>Log in with Google</button>
      )}

      {user && (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={saveScore}>Save Score</button>
          <button onClick={logout}>Log out</button>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
