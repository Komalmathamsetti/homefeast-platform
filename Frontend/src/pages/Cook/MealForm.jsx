import { useState } from "react";

export default function AddMealForm() {
  const [available, setAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-orange-600">Add Meal</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a new meal listing for HomeFeast.
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Dish Name
                </label>
                <input
                  type="text"
                  placeholder="Enter dish name"
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cuisine
                </label>
                <input
                  type="text"
                  placeholder="e.g. North Indian"
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meal Type
                </label>
                <select className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                  <option>Select meal type</option>
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Snack</option>
                  <option>Dinner</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meal Plan
                </label>
                <select className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                  <option>Select meal plan</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  placeholder="₹0.00"
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="flex items-end">
                <div className="flex w-full items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Availability
                    </p>
                    <p className="text-xs text-gray-500">
                      Show meal to customers
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAvailable(!available)}
                    className={`relative h-8 w-14 rounded-full transition ${
                      available ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                        available ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows="5"
                placeholder="Write meal details, ingredients, and serving info..."
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image Upload Placeholder
              </label>
              <div className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50 px-6 py-10 text-center transition hover:border-orange-400 hover:bg-orange-100/50">
                <div className="text-4xl">📷</div>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  Upload meal image
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG or WEBP
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                className="rounded-2xl border border-orange-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 hover:-translate-y-0.5"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}