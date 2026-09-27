"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

interface AuthContextValue {
  usuario: User | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  entrarComGoogle: () => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function garantirPerfil(user: User) {
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      nome: user.displayName ?? "",
      email: user.email ?? "",
      fotoUrl: user.photoURL ?? "",
      atualizadoEm: serverTimestamp(),
    },
    { merge: true }
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  async function entrar(email: string, senha: string) {
    await signInWithEmailAndPassword(auth, email, senha);
  }

  async function registrar(nome: string, email: string, senha: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await updateProfile(cred.user, { displayName: nome });
    await garantirPerfil(cred.user);
  }

  async function entrarComGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    await garantirPerfil(cred.user);
  }

  async function sair() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, entrar, registrar, entrarComGoogle, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
