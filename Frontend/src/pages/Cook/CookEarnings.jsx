const summaryCards = [
  { label: "Today's Earnings", value: "₹2,450" },
  { label: "Weekly Earnings", value: "₹14,800" },
  { label: "Monthly Earnings", value: "₹62,300" },
  { label: "Lifetime Earnings", value: "₹4,28,900" },
];

const transactions = [
  {
    date: "2026-07-28",
    customer: "Rahul Mehta",
    orderId: "HF-1001",
    amount: "₹450",
    status: "Completed",
  },
  {
    date: "2026-07-27",
    customer: "Ananya Shah",
    orderId: "HF-1002",
    amount: "₹620",
    status: "Completed",
  },
  {
    date: "2026-07-27",
    customer: "Karan Patel",
    orderId: "HF-1003",
    amount: "₹980",
    status: "Pending",
  },
  {
    date: "2026-07-26",
    customer: "Sneha Kapoor",
    orderId: "HF-1004",
    amount: "₹1,200",
    status: "Completed",
  },
];

const statusStyles = {
  Completed: "bg-green-100 text-green-700 ring-1 ring-green-200",
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
};

export default function EarningsDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-orange-600 sm:text-4xl">
            Earnings Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your income and monitor transaction history.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Earnings Trend
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Placeholder for weekly/monthly performance chart.
              </p>
            </div>
          </div>

          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 text-center">
            <div>
              <div className="text-5xl">📈</div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                Chart Placeholder
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Add your chart library here
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="border-b border-orange-100 px-5 py-4 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction History
            </h2>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead className="bg-orange-50">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.orderId}
                    className="border-t border-orange-100 transition hover:bg-orange-50/60"
                  >
                    <td className="px-6 py-4 text-gray-700">{tx.date}</td>
                    <td className="px-6 py-4 text-gray-900">{tx.customer}</td>
                    <td className="px-6 py-4 text-gray-700">{tx.orderId}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[tx.status]}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 p-5 md:hidden">
            {transactions.map((tx) => (
              <div
                key={tx.orderId}
                className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{tx.customer}</p>
                    <p className="mt-1 text-sm text-gray-500">{tx.orderId}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[tx.status]}`}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{" "}
                    {tx.date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Amount:</span>{" "}
                    {tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}