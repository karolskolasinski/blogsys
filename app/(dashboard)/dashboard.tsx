import LogoutButton from "@/components/LogoutButton";

function Dashboard() {
  return (
    <section className="flex-1 w-full max-w-7xl mx-auto py-4 px-2">
      <div className="text-gray-500 uppercase font-semibold mx-5 my-3">
        <small>Dashboard</small>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <LogoutButton />
      </div>
    </section>
  );
}

export default Dashboard;
