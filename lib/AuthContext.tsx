"use client";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "president" | "treasurer" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  loading: boolean;
  logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error("Auth Error:", error);

      if (error.code === "permission-denied") {
        router.push("/error"); // navigate to error page
      }
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
