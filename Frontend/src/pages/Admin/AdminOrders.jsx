import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllOrders } from "../../services/adminServices";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Preparing: "bg-blue-100 text-blue-800",
  Ready: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const normalizeStatus = (status = "") =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return ", ";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
      <div className={`mb-3 h-1.5 w-12 rounded-full ${accent}`} />
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAllOrders();

      // Supports either a direct array or { orders: [...] } response.
      const orderList = Array.isArray(data) ? data : data?.orders || [];

      setOrders(orderList);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async()=>{
      await loadOrders();
    };
    fetchOrders();
  }, [loadOrders]);

  const statistics = useMemo(() => {
    const countByStatus = (status) =>
      orders.filter(
        (order) => normalizeStatus(order.order_status) === status
      ).length;

    return {
      total: orders.length,
      pending: countByStatus("Pending"),
      preparing: countByStatus("Preparing"),
      delivered: countByStatus("Delivered"),
      cancelled: countByStatus("Cancelled"),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const status = normalizeStatus(order.order_status);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const searchableText = [
        order.id,
        order.customer_name,
        order.cook_name,
        order.dish_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="min-h-full bg-orange-50/40 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Orders
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Monitor all customer orders across HomeFeast.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
            </svg>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Orders"
            value={statistics.total}
            accent="bg-orange-500"
          />
          <StatCard
            label="Pending"
            value={statistics.pending}
            accent="bg-amber-400"
          />
          <StatCard
            label="Preparing"
            value={statistics.preparing}
            accent="bg-blue-500"
          />
          <StatCard
            label="Delivered"
            value={statistics.delivered}
            accent="bg-green-500"
          />
          <StatCard
            label="Cancelled"
            value={statistics.cancelled}
            accent="bg-red-500"
          />
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order ID, customer, cook, or meal"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center p-6">
              <div className="text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                <p className="mt-3 text-sm text-gray-500">
                  Loading orders...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-64 items-center justify-center p-6 text-center">
              <div>
                <p className="font-semibold text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => loadOrders()}
                  className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center p-6 text-center">
              <div>
                <p className="font-semibold text-gray-800">
                  No orders found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or status filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-237.5 w-full text-left text-sm">
                <thead className="border-b border-orange-100 bg-orange-50/70 text-xs uppercase tracking-wide text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Order ID</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Cook</th>
                    <th className="px-5 py-4 font-semibold">Meal</th>
                    <th className="px-5 py-4 font-semibold">Quantity</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const status = normalizeStatus(order.order_status);

                    return (
                      <tr
                        key={order.id}
                        className="transition hover:bg-orange-50/40"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {order.customer_name || ", "}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {order.cook_name || ", "}
                        </td>
                        <td className="max-w-xs px-5 py-4 text-gray-700">
                          <span className="block truncate">
                            {order.dish_name || ", "}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {order.quantity ?? ", "}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                          {formatAmount(order.total_price)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              statusStyles[status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {status || "Unknown"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                          {formatDate(order.order_date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}