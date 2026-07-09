import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  /*useEffect(()=>{
     const fetchOrders = async () => {
    try {
        const response = await API.get("/orders/my");
        console.log(response.data);
        setOrders(response.data);
    }
    catch (error) {
        console.log(error);
        setError("Unable to load orders");
    }
    finally {
        setLoading(false);
    }
  };fetchOrders();
  },[]);*/
  const fetchOrders = async () => {
    try {
        const response = await API.get("/orders/my");
        console.log(response.data);
        setOrders(response.data);
    }
    catch (error) {
        console.log(error);
        setError("Unable to load orders");
    }
    finally {
        setLoading(false);
    }
  };
  useEffect(() => {
    const loadOrders = async () => {
        await fetchOrders();
    };
    loadOrders();
   }, []);
  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-700 ring-1 ring-orange-200";
      case "Preparing":
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
      case "Out For Delivery":
        return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-700 ring-1 ring-green-200";
      case "Cancelled":
        return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
      default:
        return "bg-orange-100 text-orange-700 ring-1 ring-orange-200";
    }
  };

  const getMealTypeClasses = (mealType) => {
    switch (mealType) {
      case "Breakfast":
        return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
      case "Lunch":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      case "Dinner":
        return "bg-red-50 text-red-700 ring-1 ring-red-200";
      default:
        return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
    }
  };
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;
    try {
        await API.put(`/orders/cancel/${orderId}`);
        alert("Order cancelled successfully.");
        fetchOrders();
    }
    catch (error) {
        console.log(error);
        alert(
            error.response?.data?.message ||
            "Unable to cancel order."
        );
    }
   };
   if(error){
    return(
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-500">{error}</h1>
    </div>
    );
 }
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-orange-50 to-orange-100 text-slate-900">
      <nav className="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold text-white shadow-lg shadow-orange-200">
              H
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                HomeFeast
              </p>
              <p className="text-xs text-slate-500">Premium food dashboard</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
              Home
            </Link>
            <Link to="/browse" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
              Browse Cooks
            </Link>
            <Link to="/orders" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white">My Orders</Link>
            <Link to="/profile" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
              Profile
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">Welcome back</p>
              <p className="text-xs text-slate-500">Manage your orders</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-orange-600 font-semibold text-white shadow-lg shadow-orange-200">
              U
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700">
              Orders Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Track your meals, view delivery details, and manage active orders in one place.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-orange-100">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Orders
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{orders.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100"
              >
                <div className="animate-pulse space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="h-4 w-28 rounded bg-orange-100" />
                      <div className="h-6 w-56 rounded bg-orange-100" />
                    </div>
                    <div className="h-8 w-24 rounded-full bg-orange-100" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-20 rounded-2xl bg-orange-50" />
                    <div className="h-20 rounded-2xl bg-orange-50" />
                    <div className="h-20 rounded-2xl bg-orange-50" />
                  </div>
                  <div className="h-28 rounded-2xl bg-orange-50" />
                  <div className="h-12 w-full rounded-2xl bg-orange-100" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-white px-6 py-12 text-center shadow-sm">
            <svg
              viewBox="0 0 240 200"
              className="h-44 w-44 text-orange-400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="52" y="52" width="136" height="96" rx="24" fill="currentColor" opacity="0.12" />
              <rect x="70" y="74" width="100" height="12" rx="6" fill="currentColor" opacity="0.28" />
              <rect x="70" y="98" width="72" height="12" rx="6" fill="currentColor" opacity="0.22" />
              <circle cx="120" cy="150" r="18" fill="currentColor" opacity="0.18" />
              <path d="M88 40h64l8 16H80l8-16Z" fill="currentColor" opacity="0.18" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900">No orders yet</h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Your placed orders will appear here once you start ordering from HomeFeast.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="border-b border-orange-100 bg-linear-to-r from-orange-50 to-white px-6 py-5 sm:px-7">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                        {order.id}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {order.dish_name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Cooked by <span className="font-semibold text-slate-800">{order.cook_name}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getMealTypeClasses(
                          order.mealType
                        )}`}
                      >
                        {order.mealType}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-7">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <InfoBlock label="Quantity" value={order.quantity} />
                    <InfoBlock label="Price" value= {order.total_price} />
                    <InfoBlock label="Ordered Date" value={new Date(order.created_at).toLocaleString()} />
                    <InfoBlock
                      label="Delivery Address"
                      value={order.deliveryAddress}
                      span="md:col-span-2 xl:col-span-2"
                    />
                    <InfoBlock
                      label="Special Instructions"
                      value={order.specialInstructions}
                      span="md:col-span-2 xl:col-span-1"
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-500">
                      Order status:
                      <span className="ml-2 font-semibold text-slate-900">{order.order_status}</span>
                    </div>

                    <button
                      onClick={()=>(handleCancelOrder)}
                      className={`inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-bold shadow-sm transition sm:w-auto ${
                        order.order_status === "Delivered" || order.order_status === "Cancelled"
                          ? "cursor-not-allowed bg-gray-200 text-gray-500"
                          : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200"
                      }`}
                      disabled={order.order_status === "Delivered" || order.order_status === "Cancelled"}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function InfoBlock({ label, value, span = "" }) {
  return (
    <div className={`rounded-2xl bg-orange-50/60 p-4 ring-1 ring-orange-100 ${span}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900 wrap-break-word">
        {value}
      </p>
    </div>
  );
}