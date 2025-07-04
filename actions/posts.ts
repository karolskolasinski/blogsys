"use server";

import { db } from "@/lib/db";
import { Post } from "@/types/common";
import { redirect } from "next/navigation";

// export async function savePost(content: string, tags: string[]) {
//   const docRef = await db.collection("posts").add({
//     content,
//     tags,
//   });
//
//   return docRef.id;
// }

export async function getPosts() {
  const fields = ["title", "authorId", "createdAt", "updatedAt"];
  const snapshot = await db.collection("posts").select(...fields).get();
  const posts: Post[] = snapshot.docs.map((doc) => ({
    ...doc.data() as Post,
    id: doc.id,
  }));

  return posts;
}

export async function getPost(id: string) {
  const doc = await db.collection("posts").doc(id).get();
  if (!doc.exists) {
    return {
      id,
      title: "",
      content: "",
      tags: [],
      authorId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return {
    ...doc.data() as Post,
    id: doc.id,
  };
}

export async function deletePost(id: string) {
  await db.collection("posts").doc(id).delete();
}

export async function updatePost(id: string, content: string, tags: string[]) {
  await db.collection("posts").doc(id).update({
    content,
    tags,
  });
}

export async function savePost(formData: FormData) {
  const content = formData.get("content") as string;
  const tags = formData.get("tags") as string;

  console.log(formData, "<M<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

  redirect("/posts?saved=true");

  // const docRef = await db.collection("posts").add({
  //   content,
  //   tags: tags.split(","),
  // });
  //
  // return docRef.id;
}
