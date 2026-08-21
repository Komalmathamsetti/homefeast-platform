import API from "./api";

export const getAllCooks = async () => {
  const response = await API.get("/search/cooks");
  return response.data;
};
export const getCookProfile = async()=>{
  return API.get("/cooks/profile");
};
export const updateCookProfile = async(profileData)=>{
  return API.put("/cooks/profile",profileData);
};
export const getCookDashboard = async()=>{
  const response = await API.get("/cook-dashboard");
  return response.data;
};
export const getMyComplaints = async()=>{
  const response = await API.get("/cooks/complaints");
  return response.data;
};
export const respondToComplaint = async (
  complaintId,
  message
) => {
  const response = await API.post(
    `/cooks/complaints/${complaintId}/respond`,
    {
      message,
    }
  );
  return response.data;
};