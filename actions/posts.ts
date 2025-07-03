import { db } from "@/lib/db";
import { Post } from "@/types/common";

export async function savePost(content: string, tags: string[]) {
  const docRef = await db.collection("posts").add({
    content,
    tags,
  });

  return docRef.id;
}

export async function getPost(id: string) {
  const doc = await db.collection("posts").doc(id).get();
  return {
    ...doc.data() as Post,
    id: doc.id,
  };
}
