import { useState } from "react";
import { addMeal, updateMeal } from "../../services/menuServices";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUrl";
export default function AddMealForm({
  setActive,
  selectedMeal,
  setRefreshMenu,
}) {
  const emptyForm = {
    dish_name: "",
    cuisine: "",
    meal_type: "Veg",
    price: "",
    availability: true,
  };
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(() =>
    selectedMeal
      ? {
          dish_name: selectedMeal.dish_name,
          cuisine: selectedMeal.cuisine,
          meal_type: selectedMeal.meal_type,
          price: selectedMeal.price,
          availability: selectedMeal.availability,
        }
      : emptyForm,
  );
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("dish_name", formData.dish_name);
      data.append("cuisine", formData.cuisine);
      data.append("meal_type", formData.meal_type);
      data.append("price", formData.price);
      data.append("availability", formData.availability);

      if (image) {
        data.append("image", image);
      }

      if (selectedMeal) {
        await updateMeal(selectedMeal.id, data);
        toast.success("Meal Updated");
      } else {
        await addMeal(data);
        toast.success("Meal Added");
      }

      setRefreshMenu((prev) => !prev);
      setActive("My Menu");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Operation Failed");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-orange-600">
              {selectedMeal ? "Edit Meal" : "Add Meal"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {selectedMeal
                ? "Update your meal details."
                : "Create a new meal listing for HomeFeast."}
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
                  value={formData.dish_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dish_name: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cuisine
                </label>
                <input
                  type="text"
                  value={formData.cuisine}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      cuisine: e.target.value,
                    });
                  }}
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meal Type
                </label>
                <select
                  value={formData.meal_type}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      meal_type: e.target.value,
                    });
                  }}
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    });
                  }}
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
                    onClick={() =>
                      setFormData({
                        ...formData,
                        availability: !formData.availability,
                      })
                    }
                    className={`relative h-8 w-14 rounded-full transition ${formData.availability ? "bg-orange-500" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${formData.availability ? "left-7" : "left-1"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Dish Image
              </label>

              {selectedMeal?.image_url && !image && (
                <div className="mb-4">
                  <p className="mb-2 text-xs text-gray-500">Current Image</p>

                  <img
                    src={getImageUrl(selectedMeal.image_url)}
                    alt={selectedMeal.dish_name}
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                </div>
              )}

              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50 px-6 py-10 text-center transition hover:border-orange-400 hover:bg-orange-100/50">
                <div className="text-4xl">📷</div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  {image ? image.name : "Upload meal image"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG or WEBP • Maximum 5MB
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const selectedImage = e.target.files[0];

                    if (selectedImage) {
                      setImage(selectedImage);
                    }
                  }}
                />
              </label>

              {image && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-500">
                    New Image Preview
                  </p>

                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setActive("My Menu")}
                className="rounded-2xl border border-orange-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 hover:-translate-y-0.5"
              >
                {selectedMeal ? "Update Meal" : "Save Meal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
