import Dashboard from "@/app/(dashboard)/dashboard";
import AuthProvider from "@/app/auth-provider";

export default async function DashboardPage() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
