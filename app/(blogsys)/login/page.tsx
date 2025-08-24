import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/app/(blogsys)/login/LoginForm";

export default async function Login() {
  const session = await auth();
  if (session) {
    redirect("/posts");
  }

  return <LoginForm />;
}
