"use server";

import { db } from "@/lib/db";
import { Post } from "@/types/common";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "@/auth";

export async function getPosts() {
  const session = await auth(); // todo: move to save Post (if author)
  const role = session?.user?.role;
  const userId = session?.user?.id;
  const fields = ["title", "authorId", "createdAt", "updatedAt"];
  let query = db.collection("posts").select(...fields);
  if (role !== "admin") {
    query = query.where("authorId", "==", userId);
  }
  const docSnap = await query.get();

  const posts = docSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Post;
  });

  const authorIds = [...new Set(posts.map((post) => post.authorId).filter((id) => !!id))];
  const authors = await Promise.all(authorIds.map((id) => db.collection("users").doc(id).get()));
  const authorMap = new Map(
    authors
      .filter((doc) => doc.exists)
      .map((doc) => [doc.id, doc.data()?.name || ""]),
  );

  return posts.map((post) => ({
    ...post,
    authorName: authorMap.get(post.authorId) || "",
  }));
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
      cover: "",
    };
  }

  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data?.createdAt?.toDate(),
    updatedAt: data?.updatedAt?.toDate(),
    cover: data?.cover || "",
  } as Post;
}

export async function deletePost(id: string) {
  await db.collection("posts").doc(id).delete();
  redirect("/posts?deleted=true");
}

export async function savePost(formData: FormData) {
  const session = await auth();
  const id = formData.get("id") as string;
  const title = (formData.get("title") as string).trim();
  const content = (formData.get("content") as string).trim();
  const tags = formData.getAll("tags[]").map((t) => (t as string).trim()).filter(Boolean);

  const createdAt = id === "new"
    ? Timestamp.now()
    : Timestamp.fromDate(new Date(formData.get("createdAt") as string));

  const data: Record<string, string | string[] | Timestamp> = {
    title,
    content,
    tags,
    authorId: session?.user?.id ?? "",
    createdAt,
    updatedAt: Timestamp.now(),
  };

  const file = formData.get("cover") as File;
  if (file && file.size > 0) {
    const buf = await file.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");
    data.cover = `data:${file.type};base64,${b64}`;
  }

  if (id === "new") {
    await db.collection("posts").add(data);
  } else {
    await db.collection("posts").doc(id).update(data);
  }

  redirect("/posts?published=true");
}

export async function getGlobalTags() {
  const docSnap = await db.collection("posts").select("tags").get();
  const tags = docSnap.docs.reduce((acc, doc) => {
    const data = doc.data();
    return [...acc, ...data.tags];
  }, [] as string[]);

  return [...new Set(tags)].sort();
}
