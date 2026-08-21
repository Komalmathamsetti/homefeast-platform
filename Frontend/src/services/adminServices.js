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
export const getAllCuisines = async () => {
  const response = await API.get("/admin/cuisines");
  return response.data;
};
export const getAllCategories = async () => {
  const response = await API.get("/admin/categories");
  return response.data;
};
export const updateCuisine = async (name, newName) => {
  const response = await API.put(
    `/admin/cuisines/${encodeURIComponent(name)}`,
    {
      newName
    }
  );

  return response.data;
};
export const updateCategory = async (name, newName) => {
  const response = await API.put(
    `/admin/categories/${encodeURIComponent(name)}`,
    {
      newName
    }
  );
  return response.data;
};
export const getAllComplaints = async () => {
  const response = await API.get("/admin/complaints");
  return response.data;
};
export const getComplaintById = async (id) => {
  const response = await API.get(`/admin/complaints/${id}`);
  return response.data;
};
export const updateComplaintStatus = async (id, status) => {
  const response = await API.put(
    `/admin/complaints/${id}/status`,
    { status }
  );
  return response.data;
};
export const assignComplaintToCook = async (
  complaintId,
  cookId
) => {
  const response = await API.put(
    `/api/admin/complaints/${complaintId}/assign`,
    {
      cook_id: cookId
    }
  );
  return response.data;
};
export const getAllCooks = async () => {
  const response = await API.get(
    "/api/admin/cooks"
  );

  return response.data;
};