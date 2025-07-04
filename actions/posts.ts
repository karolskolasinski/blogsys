"use server";

import { db } from "@/lib/db";
import { Post } from "@/types/common";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";

export async function getPosts() {
  const fields = ["title", "authorId", "createdAt", "updatedAt"];
  const snapshot = await db.collection("posts").select(...fields).get();
  const posts: Post[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Post;
  });

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

  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data?.createdAt.toDate(),
    updatedAt: data?.updatedAt.toDate(),
  } as Post;
}

export async function deletePost(id: string) {
  await db.collection("posts").doc(id).delete();
  redirect("/posts?deleted=true");
}

export async function savePost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = (formData.get("title") as string).trim();
  const content = (formData.get("content") as string).trim();
  const tags = formData.getAll("tags[]").map((t) => (t as string).trim()).filter(Boolean);

  const createdAt = id === "new"
    ? Timestamp.now()
    : Timestamp.fromDate(new Date(formData.get("createdAt") as string));

  const data = {
    title,
    content,
    tags,
    createdAt,
    updatedAt: Timestamp.now(),
  };

  if (id === "new") {
    await db.collection("posts").add(data);
  } else {
    await db.collection("posts").doc(id).update(data);
  }

  redirect("/posts?published=true");
}
