import { useState,useEffect } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getCookMeals,deleteMeal } from "../../services/menuServices";

const badgeStyles = {
  Available: "bg-green-100 text-green-700 ring-1 ring-green-200",
  Unavailable: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

export default function MyMenuPage({setActive,setSelectedMeal,refreshMenu}) {
  const [meals,setmeals] = useState([]);
  const [loading,setLoading] = useState(true);
  const fetchMeals = async()=>{
    try{
      setLoading(true);
      const response = await getCookMeals();
      if(response.data.success){
        setmeals(response.data.meals);
      }
    }catch(error){
      toast.error(error.response?.data?.message || "Unable to load menu");
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    const loadMeals=async()=>{
      await fetchMeals();
    }
    loadMeals();
  },[refreshMenu]);
  if (loading) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-3xl font-bold">
        Loading Menu...
      </h1>
    </div>
  );
  }
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

          <button onClick={()=>{
            setSelectedMeal(null);
            setActive("Add Meal");
          }} className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0">
            Add New Meal
          </button>
        </div>
        {meals.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-10 text-center">
            <h2 className="text-2xl font-bold text-orange-600">
              No Meals Added
            </h2>
            <p className="text-gray-500 mt-3">
              Click "Add New Meal" to create your first meal.
            </p>
          </div>
          ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => (
            <article
              key={meal.id}
              className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 w-full overflow-hidden bg-orange-50">
                <img
                  src={meal.image ||"https://via.placeholder.com/500x300?text=Meal"}
                  alt={meal.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[meal.availability?"Available":"Unavailable"]}`}
                >
                  {meal.availability?"Available":"Unavailable"}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">
                  {meal.dish_name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{meal.cuisine}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Meal Type:</span>{" "}
                    {meal.meal_type}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Price:</span>{" "}
                    ₹{meal.price}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={()=>{
                    setSelectedMeal(meal);
                    setActive("Edit Meal");
                  }} className="flex-1 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-medium text-orange-600 transition hover:bg-orange-50">
                    Edit
                  </button>
                  <button className="flex-1 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: "Delete Meal?",
                      text: "This action cannot be undone.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Delete",
                    });
                    if (!result.isConfirmed) return;
                    try {
                      await deleteMeal(meal.id);
                      toast.success("Meal Deleted");
                      fetchMeals();
                    } catch (error) {
                      toast.error(
                        error.response?.data?.message ||"Unable to delete meal"
                      );
                    }
                    }}>Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}