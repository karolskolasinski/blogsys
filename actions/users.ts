import { db } from "@/lib/db";
import { User } from "@/types/common";

export async function getUserByEmail(email: string) {
  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      ...userData as User,
      id: userDoc.id,
    };
  } catch (error) {
    console.error("Error getting user: ", error);
    return null;
  }
}
