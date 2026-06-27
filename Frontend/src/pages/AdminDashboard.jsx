import { useState } from "react";

const NAV = [
  { label: "Dashboard", icon: "📊" },
  { label: "Profile", icon: "👤" },
  { label: "Logout", icon: "🚪" },
];

const stats = [
  { label: "Total Users", value: "1,240", color: "bg-indigo-100 text-indigo-600" },
  { label: "Active Cooks", value: "84", color: "bg-orange-100 text-orange-600" },
  { label: "Orders Today", value: "310", color: "bg-green-100 text-green-600" },
  { label: "Revenue Today", value: "$4,820", color: "bg-purple-100 text-purple-600" },
];

const users = [
  { name: "Jane Doe", email: "jane@example.com", role: "Customer", status: "Active", joined: "Jun 10" },
  { name: "Maria Garcia", email: "maria@example.com", role: "Cook", status: "Active", joined: "Mar 5" },
  { name: "Tom Richards", email: "tom@example.com", role: "Cook", status: "Suspended", joined: "Jan 22" },
  { name: "Sara Kim", email: "sara@example.com", role: "Customer", status: "Active", joined: "Jun 15" },
  { name: "Chris Turner", email: "chris@example.com", role: "Customer", status: "Inactive", joined: "Apr 1" },
];

const roleColor = {
  Customer: "bg-blue-100 text-blue-700",
  Cook: "bg-orange-100 text-orange-700",
};

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Suspended: "bg-red-100 text-red-700",
  Inactive: "bg-gray-100 text-gray-500",
};

export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-orange-400">HomeFeast</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => { setActive(label); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                ${active === label
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">AD</div>
            <div>
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            className="md:hidden text-gray-500 hover:text-orange-500"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">{active}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">Admin Panel</span>
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" title="System operational" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {active === "Dashboard" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                  <div key={s.label} className={`rounded-xl p-5 bg-white shadow-sm border border-gray-100 ${s.color}`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs mt-1 font-medium opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* User Management */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">User Management</h3>
                  <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition">
                    + Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium">Role</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Joined</th>
                        <th className="px-6 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.email} className="border-b border-gray-50 hover:bg-slate-50 transition">
                          <td className="px-6 py-3 font-medium text-gray-800">{u.name}</td>
                          <td className="px-6 py-3 text-gray-500">{u.email}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor[u.role]}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[u.status]}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-400">{u.joined}</td>
                          <td className="px-6 py-3 flex gap-3">
                            <button className="text-xs text-indigo-600 hover:underline font-medium">Edit</button>
                            <button className="text-xs text-red-500 hover:underline font-medium">
                              {u.status === "Suspended" ? "Restore" : "Suspend"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {active === "Profile" && (
            <div className="max-w-lg bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-2xl">AD</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Admin User</h3>
                  <p className="text-sm text-gray-400">Super Admin</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  ["Email", "admin@homefeast.com"],
                  ["Phone", "+1 555 999 0000"],
                  ["Role", "Super Admin"],
                  ["Last Login", "Jun 27, 2026 – 10:14 AM"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-800">{val}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                Edit Profile
              </button>
            </div>
          )}

          {active === "Logout" && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
                <p className="text-4xl mb-4">🔒</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">End Admin Session?</h3>
                <p className="text-sm text-gray-400 mb-6">You're about to log out of the HomeFeast admin panel.</p>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                  Confirm Logout
                </button>
                <button
                  onClick={() => setActive("Dashboard")}
                  className="mt-3 w-full text-sm text-gray-400 hover:text-orange-500 transition"
                >
                  Go back
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
