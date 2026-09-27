import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Todas as coleções de dados do usuário vivem em:
 *   users/{uid}/{colecao}/{docId}
 * Assim as regras de segurança do Firestore ficam simples:
 * um usuário só lê/escreve dentro do próprio "users/{uid}".
 */

function userCollection(uid: string, colecao: string) {
  return collection(db, "users", uid, colecao);
}

export function escutarColecao<T>(
  uid: string,
  colecao: string,
  callback: (itens: (T & { id: string })[]) => void,
  campoOrdenacao = "data"
) {
  const constraints: QueryConstraint[] = [];
  try {
    constraints.push(orderBy(campoOrdenacao, "desc"));
  } catch {
    // se o campo de ordenação não existir na coleção, ignora
  }

  const q = query(userCollection(uid, colecao), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const itens = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as T),
    }));
    callback(itens);
  });
}

export async function criarDocumento<T extends object>(
  uid: string,
  colecao: string,
  dados: T
) {
  const ref = await addDoc(userCollection(uid, colecao), dados);
  return ref.id;
}

export async function atualizarDocumento<T extends object>(
  uid: string,
  colecao: string,
  id: string,
  dados: Partial<T>
) {
  const ref = doc(db, "users", uid, colecao, id);
  await updateDoc(ref, dados as Record<string, unknown>);
}

export async function removerDocumento(
  uid: string,
  colecao: string,
  id: string
) {
  const ref = doc(db, "users", uid, colecao, id);
  await deleteDoc(ref);
}
