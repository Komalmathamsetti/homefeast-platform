import { useState } from "react";

const NAV = [
  { label: "Dashboard", icon: "🍳" },
  { label: "Profile", icon: "👤" },
  { label: "Logout", icon: "🚪" },
];

const stats = [
  { label: "Total Orders", value: "38", color: "bg-orange-100 text-orange-600" },
  { label: "Pending", value: "5", color: "bg-yellow-100 text-yellow-600" },
  { label: "Completed Today", value: "7", color: "bg-green-100 text-green-600" },
  { label: "Avg Rating", value: "4.8★", color: "bg-purple-100 text-purple-600" },
];

const orders = [
  { id: "#ORD-101", item: "Butter Chicken", customer: "Jane D.", status: "Preparing", time: "12:30 PM" },
  { id: "#ORD-102", item: "Biryani", customer: "Mark S.", status: "Ready", time: "12:45 PM" },
  { id: "#ORD-103", item: "Pasta Alfredo", customer: "Amy L.", status: "Pending", time: "1:00 PM" },
  { id: "#ORD-104", item: "Grilled Salmon", customer: "Chris T.", status: "Delivered", time: "11:50 AM" },
];

const statusColor = {
  Pending: "bg-gray-100 text-gray-600",
  Preparing: "bg-yellow-100 text-yellow-700",
  Ready: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

export default function CookDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-amber-50 font-sans overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-amber-600">HomeFeast</h1>
          <p className="text-xs text-gray-400 mt-1">Cook Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => { setActive(label); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                ${active === label
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"}`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">MG</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Maria Garcia</p>
              <p className="text-xs text-gray-400">Cook</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            className="md:hidden text-gray-500 hover:text-amber-500"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">{active}</h2>
          <span className="text-sm text-gray-400 hidden sm:block">Good morning, Maria 👩‍🍳</span>
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

              {/* Active Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Today's Orders</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    {orders.filter(o => o.status !== "Delivered").length} active
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-3 font-medium">Order ID</th>
                        <th className="px-6 py-3 font-medium">Dish</th>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Time</th>
                        <th className="px-6 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-gray-50 hover:bg-amber-50 transition">
                          <td className="px-6 py-3 font-mono text-gray-500">{o.id}</td>
                          <td className="px-6 py-3 font-medium text-gray-800">{o.item}</td>
                          <td className="px-6 py-3 text-gray-600">{o.customer}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[o.status]}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-400">{o.time}</td>
                          <td className="px-6 py-3">
                            {o.status !== "Delivered" && (
                              <button className="text-xs text-amber-600 hover:underline font-medium">
                                Update
                              </button>
                            )}
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
                <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-2xl">MG</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Maria Garcia</h3>
                  <p className="text-sm text-gray-400">Cook · ⭐ 4.8 Rating</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  ["Email", "maria@example.com"],
                  ["Phone", "+1 555 111 2222"],
                  ["Specialty", "Mexican & Italian"],
                  ["Member Since", "March 2024"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-800">{val}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                Edit Profile
              </button>
            </div>
          )}

          {active === "Logout" && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
                <p className="text-4xl mb-4">👋</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Leaving so soon?</h3>
                <p className="text-sm text-gray-400 mb-6">You'll be logged out of your HomeFeast cook account.</p>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                  Confirm Logout
                </button>
                <button
                  onClick={() => setActive("Dashboard")}
                  className="mt-3 w-full text-sm text-gray-400 hover:text-amber-500 transition"
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
