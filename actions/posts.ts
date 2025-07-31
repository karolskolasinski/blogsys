"use server";

import { db } from "@/lib/db";
import { ActionState, Post } from "@/types/common";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "@/auth";
import { toBase64 } from "@/lib/utils";

export async function getPosts() {
  const fields = ["title", "authorId", "createdAt", "updatedAt"];
  const query = db.collection("posts").select(...fields).orderBy("updatedAt", "desc");
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

export async function getAllAuthors() {
  const snap = await db.collection("users").select("name").get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
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

export async function savePost(_prevState: ActionState, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const authorId = formData.get("authorId") as string;
    const title = (formData.get("title") as string).trim();
    const content = (formData.get("content") as string).trim();
    const tags = formData.getAll("tags[]").map((t) => (t as string).trim()).filter(Boolean);

    const session = await auth();
    const role = session?.user?.role;
    const userId = session?.user?.id;
    const doc = await db.collection("posts").doc(id).get();
    if (doc.exists && doc.data()?.authorId !== userId && role !== "admin") {
      return {
        success: false,
        error: "Nie masz uprawnień do edycji tego posta",
      };
    }

    const createdAt = id === "new"
      ? Timestamp.now()
      : Timestamp.fromDate(new Date(formData.get("createdAt") as string));

    const data: Record<string, string | string[] | Timestamp> = {
      title,
      content,
      tags,
      authorId,
      createdAt,
      updatedAt: Timestamp.now(),
    };

    const file = formData.get("cover") as File;
    if (file && file.size > 0) {
      data.cover = await toBase64(file);
    }

    if (id === "new") {
      await db.collection("posts").add(data);
    } else {
      await db.collection("posts").doc(id).update(data);
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Błąd zapisu",
    };
  }
}

export async function getAllTags() {
  const docSnap = await db.collection("posts").select("tags").get();
  const tags: string[] = docSnap.docs.reduce((acc, doc) => {
    const data = doc.data();
    return [...acc, ...data.tags];
  }, [] as string[]);

  return [...new Set(tags)].sort();
}
