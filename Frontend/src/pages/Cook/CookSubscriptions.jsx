import { useState } from "react";

const requests = [
  {
    id: 1,
    customerName: "Rahul Mehta",
    mealPlan: "Weekly Lunch Plan",
    subscriptionDate: "2026-07-18",
    status: "Pending",
  },
  {
    id: 2,
    customerName: "Ananya Shah",
    mealPlan: "Daily Dinner Plan",
    subscriptionDate: "2026-07-19",
    status: "Accepted",
  },
  {
    id: 3,
    customerName: "Karan Patel",
    mealPlan: "Monthly Full Meal Plan",
    subscriptionDate: "2026-07-20",
    status: "Rejected",
  },
];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Accepted: "bg-green-100 text-green-700 ring-1 ring-green-200",
  Rejected: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

export default function SubscriptionRequestsDashboard() {
  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter(
    (item) =>
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.mealPlan.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">
                Subscription Requests
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Review and manage meal subscription requests from customers.
              </p>
            </div>

            <div className="w-full sm:max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm md:block">
          <table className="w-full border-collapse">
            <thead className="bg-orange-50">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Meal Plan</th>
                <th className="px-6 py-4">Subscription Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-orange-100 transition hover:bg-orange-50/60"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {request.customerName}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{request.mealPlan}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {request.subscriptionDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600">
                        Accept
                      </button>
                      <button className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.customerName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{request.mealPlan}</p>
                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Date:</span>{" "}
                  {request.subscriptionDate}
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <button className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600">
                  Accept
                </button>
                <button className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}