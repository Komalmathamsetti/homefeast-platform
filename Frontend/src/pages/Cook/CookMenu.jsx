const meals = [
  {
    id: 1,
    name: "Veg Thali",
    cuisine: "North Indian",
    type: "Lunch",
    plan: "Daily",
    price: "₹180",
    availability: "Available",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Paneer Wrap",
    cuisine: "Fusion",
    type: "Snack",
    plan: "Weekly",
    price: "₹120",
    availability: "Limited",
    image:
      "https://images.unsplash.com/photo-1528731708534-816fe59f90cb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Chicken Biryani",
    cuisine: "Hyderabadi",
    type: "Dinner",
    plan: "Daily",
    price: "₹250",
    availability: "Unavailable",
    image:
      "https://images.unsplash.com/photo-1569058242257-92a9f2a3d9f7?auto=format&fit=crop&w=900&q=80",
  },
];

const badgeStyles = {
  Available: "bg-green-100 text-green-700 ring-1 ring-green-200",
  Limited: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Unavailable: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

export default function MyMenuPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-orange-600 sm:text-4xl">
              My Menu
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your meals, pricing, and availability.
            </p>
          </div>

          <button className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0">
            Add New Meal
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => (
            <article
              key={meal.id}
              className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 w-full overflow-hidden bg-orange-50">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[meal.availability]}`}
                >
                  {meal.availability}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">
                  {meal.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{meal.cuisine}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Meal Type:</span>{" "}
                    {meal.type}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Meal Plan:</span>{" "}
                    {meal.plan}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Price:</span>{" "}
                    {meal.price}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-medium text-orange-600 transition hover:bg-orange-50">
                    Edit
                  </button>
                  <button className="flex-1 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}