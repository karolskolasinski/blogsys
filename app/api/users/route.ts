import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
// import { authOptions } from "@/auth/auth-config";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = body?.id;
    const data = {
      ...body.name ? { name: body.name } : {},
      ...body.email ? { email: body.email } : {},
      ...body.fullName ? { fullName: body.fullName } : {},
      ...body.model ? { model: body.model } : {},
      ...body.registration ? { registration: body.registration } : {},
      ...body.location ? { location: body.location } : {},
      ...body.lat ? { lat: body.lat } : {},
      ...body.lng ? { lng: body.lng } : {},
      ...body.role ? { role: body.role } : {},
    };

    if (id) {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", body.email));
      const existingUsers = await getDocs(q);

      if (!existingUsers.empty) {
        return NextResponse
          .json({ error: "Użytkownik z tym adresem email już istnieje" }, { status: 400 });
      }

      await addDoc(usersRef, {
        ...data,
        password: await bcrypt.hash(body.password, 12),
        updatedAt: serverTimestamp(),
        isOpen: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd zapisu" }, { status: 500 });
  }
}
