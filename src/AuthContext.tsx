import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, db, doc, getDoc, setDoc } from './firebase';
import { UserProfile } from './types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Anonymous',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'user',
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            displayName: newUser.displayName,
            email: newUser.email,
            photoURL: newUser.photoURL,
            role: newUser.role,
          });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
