import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  getAdminDashboard,
} from "../../services/adminServices";
import CookApprovals from "./CookApproval";
import UsersCooks from "./UsersCooks";
import AdminOrders from "./AdminOrders";
import AdminSubscriptions from "./AdminSubscriptions";

const NAV = [
  { label: "Dashboard", icon: "📊" },
  { label: "Users & Cooks", icon: "👥" },
  { label: "Cook Approvals", icon: "👨‍🍳" },
  { label: "Orders", icon: "🛒" },
  { label: "Subscriptions", icon: "📋" },
  { label: "Categories & Cuisines", icon: "🍱" },
  { label: "Complaints & Disputes", icon: "⚠️" },
  { label: "Logout", icon: "🚪" },
];

const statCards = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: "👥",
  },
  {
    key: "totalCustomers",
    label: "Total Customers",
    icon: "🧑",
  },
  {
    key: "totalCooks",
    label: "Total Cooks",
    icon: "👨‍🍳",
  },
  {
    key: "pendingCooks",
    label: "Pending Cooks",
    icon: "⏳",
  },
  {
    key: "ordersToday",
    label: "Orders Today",
    icon: "🛒",
  },
  {
    key: "revenueToday",
    label: "Revenue Today",
    icon: "💰",
    money: true,
  },
  {
    key: "activeSubscriptions",
    label: "Active Subscriptions",
    icon: "❤️",
  },
];
export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      console.log("ADMIN DASHBOARD:", response);
      setSummary(response.summary);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Unable to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchDashboard = async()=>{
      await loadDashboard();
    };
    fetchDashboard();
  }, []);
  const handleNavigation = (label) => {
    setSidebarOpen(false);

    if (label === "Logout") {
      setActive("Logout");
      return;
    }

    setActive(label);
  };
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });
    if (!result.isConfirmed) {
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await Swal.fire({
      title: "Logged Out!",
      text: "You have been logged out successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate("/");
  };
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-amber-50">
        <h1 className="text-3xl font-bold text-orange-500">
          Loading Admin Dashboard...
        </h1>
      </div>
    );
  }
  return (
    <div className="flex h-screen overflow-hidden bg-amber-50 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 flex h-full w-64 flex-col bg-gray-900 text-white shadow-lg transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        md:static md:translate-x-0`}
      >
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-6">
          <h1 className="text-2xl font-bold text-orange-400">
            HomeFeast
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Admin Panel
          </p>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {NAV.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => handleNavigation(label)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition
              ${
                active === label
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg">
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>
        {/* Admin */}
        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "A"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-400">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <button
            className="text-gray-500 hover:text-orange-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {active}
          </h2>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-400 sm:block">
              Welcome Back, {user?.name || "Admin"}
            </span>
            <span
              className="h-2 w-2 rounded-full bg-green-500"
              title="System operational"
            />
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ================= DASHBOARD ================= */}
          {active === "Dashboard" && (
            <div className="space-y-6">
              {/* Heading */}
              <div>
                <h1 className="text-3xl font-bold text-orange-600">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage and monitor the HomeFeast platform.
                </p>
              </div>
              {/* Statistics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {statCards.map((card) => {
                  const value = summary?.[card.key] ?? 0;
                  return (
                    <div
                      key={card.key}
                      className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {card.label}
                          </p>
                          <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {card.money
                              ? `₹${Number(value).toLocaleString(
                                  "en-IN"
                                )}`
                              : Number(value).toLocaleString(
                                  "en-IN"
                                )}
                          </h2>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                          {card.icon}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Admin Features */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Admin Features
                  </h2>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <span>👥</span>
                      <span className="text-gray-600">
                        Manage users and cooks
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>👨‍🍳</span>
                      <span className="text-gray-600">
                        Approve cook registrations
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>🛒</span>
                      <span className="text-gray-600">
                        Monitor orders and subscriptions
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>🍱</span>
                      <span className="text-gray-600">
                        Manage categories and cuisines
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>⚠️</span>
                      <span className="text-gray-600">
                        Handle complaints and disputes
                      </span>
                    </div>
                  </div>
                </div>
                {/* Today's Overview */}
                <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Today's Overview
                  </h2>
                  <div className="mt-5 space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-4">
                      <span className="text-gray-600">
                        Orders Today
                      </span>
                      <span className="font-semibold">
                        {summary?.ordersToday ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-4">
                      <span className="text-gray-600">
                        Revenue Today
                      </span>
                      <span className="font-semibold text-green-600">
                        ₹
                        {Number(
                          summary?.revenueToday ?? 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-4">
                      <span className="text-gray-600">
                        Pending Cook Registrations
                      </span>
                      <span className="font-semibold text-orange-600">
                        {summary?.pendingCooks ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Active Subscriptions
                      </span>
                      <span className="font-semibold">
                        {summary?.activeSubscriptions ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ================= PLACEHOLDER PAGES ================= */}
          {active === "Cook Approvals" && (
            <CookApprovals onCookAction={loadDashboard}/>)}
          {active === "Users & Cooks" && (
            <UsersCooks/>
          )}
          {active === "Orders" && (
            <AdminOrders/>
          )}
          {active === "Subscriptions" && (
            <AdminSubscriptions/>
          )}
            {/* ================= OTHER PAGES ================= */}
            {active !== "Dashboard" &&active !== "Cook Approvals" &&
            active !== "Logout"  && active !== "Users & Cooks" && active !== "Orders" && active !== "Subscriptions" && (
            <div className="flex min-h-125 items-center justify-center">
              <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
                 <div className="text-5xl">🚧</div>
                 <h2 className="mt-4 text-xl font-bold text-gray-900">{active}</h2>
                 <p className="mt-2 text-sm text-gray-500">This section will be built next.</p>
                </div>
              </div>
            )}
          {/* ================= LOGOUT ================= */}
          {active === "Logout" && (
            <div className="flex h-full items-center justify-center">

              <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">

                <p className="mb-4 text-4xl">
                  🔒
                </p>

                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  End Admin Session?
                </h3>

                <p className="mb-6 text-sm text-gray-400">
                  You're about to log out of the HomeFeast admin panel.
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Confirm Logout
                </button>

                <button
                  onClick={() => setActive("Dashboard")}
                  className="mt-3 w-full text-sm text-gray-400 transition hover:text-orange-500"
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