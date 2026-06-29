import API from "./api";

export const getAllCooks = async () => {
  const response = await API.get("/search/cooks");
  return response.data;
};