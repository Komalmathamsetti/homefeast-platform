import API from "./api";
export const getMySubscriptions = async()=>{
    const response = await API.get("/subscriptions/my");
    return response.data;
};
export const cancelSubscription = async(id)=>{
    const response = await API.put(`/subscriptions/cancel/${id}`);
    return response.data;
};
export const getMySubscribers = async()=>{
    const response = await API.get(`/subscriptions/cook`);
    return response.data;
};
export const updateSubscriptions = async(id,status)=>{
    const response = await API.put(`/subscriptions/${id}/status`,{status});
    return response.data;
}