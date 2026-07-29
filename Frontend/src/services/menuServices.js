import API from "./api";
export const getCookMeals = async()=>{
    return await API.get("/menus/my-menu");
}
export const getAllMeals = async () => {
  return await API.get("/menus");
};
export const getMealById = async (mealId) => {
  return await API.get(`/menus/${mealId}`);
};
export const addMeal = async(mealData)=>{
    return API.post("/menus",mealData);
};
export const updateMeal = async (id, mealData) => {
  return await API.put(`/menus/${id}`, mealData);
};
export const deleteMeal = async (mealId) => {
  return await API.delete(`/menus/${mealId}`);
};