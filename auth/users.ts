import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function getUserByCredentials(email: string, password: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();

  const isValid = await bcrypt.compare(password, userData.password);
  if (!isValid) {
    return null;
  }

  return {
    id: userDoc.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };
}
