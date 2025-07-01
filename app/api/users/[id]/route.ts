import { getServerSession } from "next-auth";
// import { authOptions } from "@/auth/auth-config";
import { NextRequest, NextResponse } from "next/server";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const body = await req.formData();
  const method = body.get("method");

  if (method === "DELETE") {
    const id = body.get("id") as string;
    const userRef = doc(db, "users", id);
    try {
      await deleteDoc(userRef);
      return NextResponse.redirect(new URL("/dashboard/users", req.url));
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Błąd usuwania" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const userRef = doc(db, "users", id);
  const user = await getDoc(userRef);

  if (!user.exists()) {
    return NextResponse.json({ error: "Nie znaleziono użytkownika" }, { status: 404 });
  }

  return NextResponse.json(user.data());
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const body = await req.json();
  const isOpen = body.isOpen === true;

  const userRef = doc(db, "users", id);
  try {
    await updateDoc(userRef, { isOpen });
    return NextResponse.redirect(new URL("/dashboard/users", req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd aktualizacji" }, { status: 500 });
  }
}
