import { useMemo, useState } from "react";

const initialOrders = [
  {
    id: "HF-1001",
    customer: "Rahul Mehta",
    meal: "Veg Thali",
    quantity: 2,
    address: "Andheri West, Mumbai",
    status: "Pending",
  },
  {
    id: "HF-1002",
    customer: "Ananya Shah",
    meal: "Paneer Wrap",
    quantity: 1,
    address: "Juhu, Mumbai",
    status: "Preparing",
  },
  {
    id: "HF-1003",
    customer: "Karan Patel",
    meal: "Chicken Biryani",
    quantity: 3,
    address: "Bandra East, Mumbai",
    status: "Ready",
  },
  {
    id: "HF-1004",
    customer: "Sneha Kapoor",
    meal: "South Indian Combo",
    quantity: 2,
    address: "Powai, Mumbai",
    status: "Delivered",
  },
];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Preparing: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  Ready: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Delivered: "bg-green-100 text-green-700 ring-1 ring-green-200",
};

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.meal.toLowerCase().includes(search.toLowerCase()) ||
        order.address.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600 sm:text-4xl">
                Orders Management
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Track and update customer orders in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-140">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm md:block">
          <table className="w-full border-collapse">
            <thead className="bg-orange-50">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Meal</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Delivery Address</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-orange-100 transition hover:bg-orange-50/60"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-700">{order.meal}</td>
                  <td className="px-6 py-4 text-gray-700">{order.quantity}</td>
                  <td className="px-6 py-4 text-gray-700">{order.address}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    >
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Ready</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.id}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{order.customer}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Meal:</span>{" "}
                  {order.meal}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Quantity:</span>{" "}
                  {order.quantity}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Address:</span>{" "}
                  {order.address}
                </p>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Update Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                >
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}