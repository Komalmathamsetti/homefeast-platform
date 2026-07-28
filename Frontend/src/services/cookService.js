import API from "./api";

export const getAllCooks = async () => {
  const response = await API.get("/search/cooks");
  return response.data;
};
export const getCookProfile = async()=>{
  const response = await API.get("/cooks/profile");
  return response.data;
};
export const updateCookProfile = async(profileData)=>{
  return API.put("/cooks/profile",profileData);
}