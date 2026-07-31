import API from "./api";
export const getCookOrders = async () => {
    const response = await API.get("/orders/cook");
    return response.data;
};
export const updateOrderStatus = async (id, status) => {
    const response = await API.put(
        `/orders/${id}/status`,
        { status }
    );
    return response.data;
};