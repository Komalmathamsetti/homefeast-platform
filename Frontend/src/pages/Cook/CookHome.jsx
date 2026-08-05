
const CookHome = ({ dashboard,setActive }) => {
  const summary = dashboard?.summary || {};
  const recentOrders = dashboard?.recentOrders || [];
  const recentSubscribers = dashboard?.recentSubscribers || [];

  const latestOrders = recentOrders.slice(0, 5);
  const latestSubscribers = recentSubscribers.slice(0, 5);

  const completedOrders =
    recentOrders?.filter((order) => order?.order_status === "Delivered")?.length || 0;
  const pendingOrders =
    recentOrders?.filter((order) => order?.order_status === "Pending")?.length || 0;
  const preparingOrders =
    recentOrders?.filter((order) => order?.order_status === "Preparing")?.length || 0;
  const deliveredOrders =
    recentOrders?.filter((order) => order?.order_status === "Delivered")?.length || 0;

  const hasAnyData =
    (summary?.orders || 0) > 0 ||
    (summary?.earnings || 0) > 0 ||
    (summary?.meals || 0) > 0 ||
    (summary?.subscriptions || 0) > 0 ||
    recentOrders.length > 0 ||
    recentSubscribers.length > 0;

  const orderBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "preparing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "ready":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };
  const subscriberBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const summaryCards = [
    {
      label: "Today's Orders",
      value: summary?.orders ?? 0,
      icon: "📦",
    },
    {
      label: "Today's Earnings",
      value: `₹${summary?.earnings ?? 0}`,
      icon: "💰",
    },
    {
      label: "Meals Listed",
      value: summary?.meals ?? 0,
      icon: "🍱",
    },
    {
      label: "Active Subscribers",
      value: summary?.subscriptions ?? 0,
      icon: "❤️",
    },
  ];

  const actionButtons=[
    {label:"Add Meal",icon:"➕",page:"Add Meal"},
    {label:"View Orders",icon:"📦",page:"Orders"},
    {label:"View Earnings",icon:"💰",page:"Earnings"},
    {label:"Edit Profile",icon:"👤",page:"Profile" }
  ];
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-400 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-bold sm:text-3xl">
                👨‍🍳 Welcome Back, {dashboard?.cook_name || "Cook"}
              </p>
              <p className="mt-2 text-sm text-orange-50 sm:text-base">
                Here's an overview of your HomeFeast business today.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-4xl shadow-md">
              🍳
            </div>
          </div>
        </div>

        {!hasAnyData ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <div className="text-5xl">🍽️</div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No business activity yet.
            </h2>
            <p className="mt-2 text-gray-600">
              Start by adding meals to your menu and customers will start
              placing orders.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className="group rounded-3xl bg-white p-5 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                    {card.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-500">
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders + Subscribers */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>

                <div className="mt-4 overflow-x-auto">
                  {latestOrders.length > 0 ? (
                    <table className="min-w-full border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-left text-sm text-gray-500">
                          <th className="px-3 py-2 font-medium">Order ID</th>
                          <th className="px-3 py-2 font-medium">
                            Customer Name
                          </th>
                          <th className="px-3 py-2 font-medium">Meal Name</th>
                          <th className="px-3 py-2 font-medium">Quantity</th>
                          <th className="px-3 py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestOrders.map((order, index) => (
                          <tr
                            key={order?.id || index}
                            className="rounded-2xl bg-orange-50/50 text-sm text-gray-700"
                          >
                            <td className="px-3 py-3 font-medium text-gray-900">
                              {order?.id || "-"}
                            </td>
                            <td className="px-3 py-3">
                              {order?.customer_name || "-"}
                            </td>
                            <td className="px-3 py-3">{order?.dish_name || "-"}</td>
                            <td className="px-3 py-3">{order?.quantity ?? "-"}</td>
                            <td className="px-3 py-3">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${orderBadgeClass(
                                  order?.order_status
                                )}`}
                              >
                                {order?.order_status || "Unknown"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="py-10 text-center text-gray-500">
                      No recent orders.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Latest Subscribers
                </h2>

                <div className="mt-4 overflow-x-auto">
                  {latestSubscribers.length > 0 ? (
                    <table className="min-w-full border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-left text-sm text-gray-500">
                          <th className="px-3 py-2 font-medium">
                            Customer Name
                          </th>
                          <th className="px-3 py-2 font-medium">Plan Type</th>
                          <th className="px-3 py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestSubscribers.map((subscriber, index) => (
                          <tr
                            key={subscriber?.id || index}
                            className="rounded-2xl bg-orange-50/50 text-sm text-gray-700"
                          >
                            <td className="px-3 py-3 font-medium text-gray-900">
                              {subscriber?.name || "-"}
                            </td>
                            <td className="px-3 py-3">
                              {subscriber?.plan_type || "-"}
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${subscriberBadgeClass(
                                  subscriber?.status
                                )}`}
                              >
                                {subscriber?.status || "Unknown"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="py-10 text-center text-gray-500">
                      No recent subscribers.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {actionButtons.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={()=>setActive(action.page)}
                    className="flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-orange-500 to-orange-400 px-5 py-4 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Overview */}
            <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Performance Overview
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Completed Orders", value: completedOrders },
                  { label: "Pending Orders", value: pendingOrders },
                  { label: "Preparing Orders", value: preparingOrders },
                  { label: "Delivered Orders", value: deliveredOrders },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl bg-orange-50 p-5 shadow-sm"
                  >
                    <div className="text-sm font-medium text-gray-500">
                      {item.label}
                    </div>
                    <div className="mt-2 text-3xl font-bold text-gray-900">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CookHome;