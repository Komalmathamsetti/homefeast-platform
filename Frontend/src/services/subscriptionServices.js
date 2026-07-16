import API from "./api";
export const getMySubscriptions = async()=>{
    const response = await API.get("/subscriptions/my");
    return response.data;
};
export const cancelSubscription = async(id)=>{
    const response = await API.put(`/subscriptions/${id}`);
    return response.data;
};