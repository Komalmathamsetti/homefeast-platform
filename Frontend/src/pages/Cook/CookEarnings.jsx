import { useState,useEffect } from "react";
import { getCookEarnings } from "../../services/orderServices";
import toast from "react-hot-toast";

const statusStyles = {
    Delivered:"bg-green-100 text-green-700 ring-1 ring-green-200",
    Pending:"bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    Preparing:"bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    Ready:"bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    Cancelled:"bg-red-100 text-red-700 ring-1 ring-red-200"
};
export default function EarningsDashboard() {
  const [summary,setSummary] = useState({
    today:0,
    week:0,
    month:0,
    lifetime:0
  });
  const summaryCards=[
    {label:"Today's Earnings",value:`₹${summary.today}`},
    {label:"Weekly Earnings",value:`₹${summary.weekly}`},
    {label:"Monthly Earnings",value:`₹${summary.monthly}`},
    {label:"Lifetime Earnings",value:`₹${summary.lifetime}`}
  ];
  const [transactions,setTransactions] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    const fetchEarnings = async()=>{
      try{
        setLoading(true);
        const response = await getCookEarnings();
        setSummary(response.summary);
        setTransactions(response.transactions);
      }catch(error){
        console.log(error);
        toast.error(error.response?.data?.message || "Unable to fetch earnings.");
      }finally{
        setLoading(false);
      }
    }
    fetchEarnings();
  },[]);
  if(loading){
    return(
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-3xl font-bold">
        Loading...
      </h1>
    </div>
    );
  }
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
                    key={`#${tx.id}`}
                    className="border-t border-orange-100 transition hover:bg-orange-50/60"
                  >
                    <td className="px-6 py-4 text-gray-700">{new Date(tx.order_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-900">{tx.customer_name}</td>
                    <td className="px-6 py-4 text-gray-700">#${tx.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {`₹${tx.total_price}`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[tx.order_status]}`}
                      >
                        {tx.order_status}
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
                key={`#${tx.id}`}
                className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{tx.customer_name}</p>
                    <p className="mt-1 text-sm text-gray-500">#${tx.id}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[tx.order_status]}`}
                  >
                    {tx.order_status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{" "}
                    {new Date(tx.order_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Amount:</span>{" "}
                    {`₹${tx.total_price}`}
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