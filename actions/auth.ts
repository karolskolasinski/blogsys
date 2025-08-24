"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { ActionResponse, LoginData } from "@/types/common";

export async function login(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<LoginData>> {
  const email = formData?.get("email") as string;
  const password = formData?.get("password") as string;

  try {
    await signIn("credentials", { redirect: false, email, password });
  } catch (err) {
    console.error(err);

    const messages = err instanceof AuthError && err.type === "CredentialsSignin"
      ? ["Podano błędne dane logowania"]
      : ["Wystąpił błąd"];

    return {
      success: false,
      messages,
      data: { email },
    };
  }

  return {
    success: true,
    messages: ["Zalogowano poprawnie"],
  };
}
