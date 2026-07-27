import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getProfile,updateProfile } from "../../services/customerServices";
import toast from "react-hot-toast";
const NAV = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Browse Cooks", icon: "🍱" },
  { label: "My Orders", icon: "📦" },
  { label: "My Subscriptions", icon: "📅" },
  { label: "Profile", icon: "👤" },
  { label: "Logout", icon: "🚪" },
];
const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Preparing: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};
export default function CustomerDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [stats,setStats] = useState({
    totalOrders:0,
    activeSubscriptions:0,
    pendingOrders:0,
    completedOrders:0
  });
  const [recentOrders,setRecentOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const [profile,setProfile] = useState({
    name:"",
    email:"",
    phone:"",
    address:""
  });
  const [editing,setEditing] = useState(false);
  const [saving,setSaving] = useState(false);
  useEffect(()=>{
    const fetchDashboard = async()=>{
    try{
      const response = await API.get("/customer/dashboard");
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders);
      const profileData = await getProfile();
      setProfile(profileData);
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  };
  fetchDashboard();
  },[]);
  const handleLogout = ()=>{
     localStorage.removeItem("token");
     localStorage.removeItem("role");
     localStorage.removeItem("email");
     localStorage.removeItem("user");
     navigate("/");
  }
  const handleChange = (e)=>{
    setProfile({
      ...profile,
      [e.target.name]:e.target.value
    });
  };
  const saveProfile = async()=>{
    try{
      setSaving(true);
      const response = await updateProfile({
        name:profile.name,
        email:profile.email,
        phone:profile.phone,
        address:profile.address
      });
      setProfile(response.user);
      const currentUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user",JSON.stringify({
        ...currentUser,
        name: response.user.name,
        phone: response.user.phone
      }));
      toast.success("Profile Saved Successfully");
      setEditing(false);
    }catch(error){
      console.log(error);
      toast.error("Unable to save profile");
    }finally{
      setSaving(false);
    }
  };
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
    <div className="flex h-screen bg-orange-50 font-sans overflow-hidden">
      {/* Overlay (mobile) */}
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
          <h1 className="text-2xl font-bold text-orange-500">HomeFeast</h1>
          <p className="text-xs text-gray-400 mt-1">Customer Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => { 
                setActive(label); 
                setSidebarOpen(false); 
                if(label === "Browse Cooks"){
                  navigate("/browse-cooks");
                }else if(label === "My Orders"){
                  navigate("/orders");
                }else if(label === "My Subscriptions"){
                  navigate("/subscriptions");
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                ${active === label
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"}`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm"> {profile.name? profile.name.charAt(0).toUpperCase(): "U"}</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
              <p className="text-xs text-gray-400">Customer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
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
          <span className="text-sm text-gray-400 hidden sm:block">Welcome back,{profile.name} 👋</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {active === "Dashboard" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {label:"Orders Placed",value:stats.totalOrders,color:"bg-orange-100 text-orange-600"},
                  {label:"Pending Orders",value:stats.pendingOrders,color:"bg-yellow-100 text-yellow-600"},
                  {label:"Active Subscriptions",value:stats.activeSubscriptions,color:"bg-blue-100 text-blue-600"},
                  {label:"Completed Orders",value:stats.completedOrders,color:"bg-green-100 text-green-600"}
                ].map((s)=>(
                  <div key={s.label} className={`rounded-xl p-5 ${s.color} bg-white shadow-sm border border-gray-100`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs mt-1 font-medium opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-3 font-medium">Order ID</th>
                        <th className="px-6 py-3 font-medium">Dish</th>
                        <th className="px-6 py-3 font-medium">Cook</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-orange-50 transition">
                          <td className="px-6 py-3 font-mono text-gray-500">{order.id}</td>
                          <td className="px-6 py-3 text-gray-800 font-medium">{order.dish_name}</td>
                          <td className="px-6 py-3 text-gray-600">{order.cook_name}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.order_status]}`}>
                              {order.order_status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-400">{new Date(order.order_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {active === "Profile" && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center text-3xl font-bold text-orange-600">
                    {profile.name
                        ? profile.name.charAt(0).toUpperCase()
                        : "U"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {profile.name}
                    </h2>
                    <p className="text-gray-500">
                      Customer 
                    </p>
                  </div>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border rounded-lg px-4 py-3 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border rounded-lg px-4 py-3 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Address
                  </label>
                  <textarea
                    rows={4}
                    name="address"
                    value={profile.address || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border rounded-lg px-4 py-3 disabled:bg-gray-100"
                  />
                </div>
              </div>
              {editing && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                  >{saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={async() => {
                        setEditing(false);
                        const profileData = await getProfile();
                        setProfile(profileData);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                  >Cancel
                  </button>
                </div>
              )}
            </div>
          )}
          {active === "Logout" && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
                <p className="text-4xl mb-4">👋</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Leaving so soon?</h3>
                <p className="text-sm text-gray-400 mb-6">You'll be logged out of your HomeFeast account.</p>
                <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition">
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
