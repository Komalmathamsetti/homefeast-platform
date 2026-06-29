import API from "./api";
export const getAllCooks =() =>{
   return API.get("/search/cooks");
};
export const searchCooks = (query) => {
    return API.get(`/search?search=${query}`);
};
export const filterCuisine = (cuisine) => {
    return API.get(`/search?cuisine=${cuisine}`);
};
export const getCookDetails = (id) => {
    return API.get(`/search/cook/${id}`);
};