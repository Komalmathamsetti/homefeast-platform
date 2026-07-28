import { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom";
import CookEarnings from "./CookEarnings";
import CookMenu from "./CookMenu";
import CookOrders from "./CookOrders";
import CookProfile from "./CookProfile";
import CookSubscriptions from "./CookSubscriptions";
import Swal from "sweetalert2";
const NAV = [
  { label: "Home", icon: "🏠" },
  { label: "Dashboard", icon: "📊" },
  { label: "Profile", icon: "👤" },
  { label: "My Menu", icon: "🍱" },
  { label: "Subscriptions", icon: "📋" },
  { label: "Orders", icon: "🛒" },
  { label: "Earnings", icon: "💰" },
  { label: "Logout", icon: "🚪" },
];
export default function CookDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const renderPage = ()=>{
    switch(active){
      case "Profile":
        return <CookProfile/>
      case "My Menu":
        return <CookMenu/>
      case "Orders":
        return <CookOrders/>
      case "Subscriptions":
        return <CookSubscriptions/>
      case "Earnings":
        return <CookEarnings/>
    }
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
        reverseButtons: true
    });
    if (!result.isConfirmed) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await Swal.fire({
        title: "Logged Out!",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
    });
    navigate("/");
  };
  useEffect(() => {
    const loadData = async () => {
        // fetch profile/dashboard
        setLoading(false);
    };
    loadData();
  }, []);
  if(loading){
    return(
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-orange-500">
          Loading Dashboard...
        </h1>
      </div>
    )
  }
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
              onClick={() => { 
                setSidebarOpen(false); 
                if(label === "Home"){
                  navigate("/");
                }else if(label === "Logout"){
                  setActive("Logout");
                  return;
                }
                setActive(label);
              }}
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
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">{user?.name?user?.name.charAt(0).toUpperCase():"U"}</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.name||"Cook"}</p>
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
          <span className="text-sm text-gray-400 hidden sm:block">Welcome Back,{user?.name || "Cook"} 👩‍🍳</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
          {active === "Logout" && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
                <p className="text-4xl mb-4">👋</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Leaving so soon?</h3>
                <p className="text-sm text-gray-400 mb-6">You'll be logged out of your HomeFeast cook account.</p>
                <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition">
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
