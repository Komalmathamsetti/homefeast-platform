import API from "./api";
export const getProfile = async()=>{
   const response = await API.get("/customer/profile");
   return response.data;
};
export const updateProfile = async(profileData)=>{
    const response = API.put("/customer/profile",profileData);
    return (await response).data;
};
export const createComplaint = async(data)=>{
    const response = await API.post("/complaints",data);
    return response.data;
};
export const getMyComplaints = async () => {
  const response = await API.get("/customer/complaints");
  return response.data;
};