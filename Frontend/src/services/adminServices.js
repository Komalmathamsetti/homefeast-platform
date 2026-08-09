import API from "./api";
export const getAdminDashboard = async () => {
  const response = await API.get("/admin/dashboard");
  return response.data;
};
export const getPendingCooks = async () => {
  const response = await API.get("/admin/pending-cooks");
  return response.data;
};
export const approveCook = async (id) => {
  const response = await API.put(`/admin/approve-cook/${id}`);
  return response.data;
};
export const rejectCook = async (id) => {
  const response = await API.put(`/admin/reject-cook/${id}`);
  return response.data;
};
export const getAllUsers = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};
export const getAllOrders = async () => {
  const response = await API.get("/admin/orders");
  return response.data;
};
export const getAllSubscriptions = async () => {
  const response = await API.get("/admin/subscriptions");
  return response.data;
};