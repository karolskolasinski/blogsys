"use server";

import { db } from "@/lib/db";
import { ActionResponse, Post } from "@/types/common";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "@/auth";
import { toBase64 } from "@/lib/utils";

export async function getPosts(): Promise<ActionResponse<Post[]>> {
  try {
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

    return {
      success: true,
      messages: [],
      data: posts.map((post) => ({
        ...post,
        authorName: authorMap.get(post.authorId) || "",
      })),
    };
  } catch (err) {
    return {
      success: false,
      messages: [err instanceof Error ? err.message : "Coś poszło nie tak"],
    };
  }
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

export async function savePost(_: unknown, formData: FormData): Promise<ActionResponse> {
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
        messages: ["Brak uprawnień"],
      };
    }

    const post: Record<string, string | string[] | Timestamp> = {
      title,
      content,
      tags,
      authorId,
      ...(id === "new" && { createdAt: Timestamp.now() }),
      updatedAt: Timestamp.now(),
    };

    const file = formData.get("cover") as File;
    if (file && file.size > 0) {
      post.cover = await toBase64(file);
    }

    const docRef = db.collection("posts");
    if (id === "new") {
      await docRef.add(post);
    } else {
      await docRef.doc(id).update(post);
    }

    return {
      success: true,
      messages: ["Zapisano"],
    };
  } catch (err) {
    return {
      success: false,
      messages: [err instanceof Error ? err.message : "Błąd zapisu"],
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
