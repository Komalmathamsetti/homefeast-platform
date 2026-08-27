import API from "./api";
export const getNotifications = async()=>{
    const response = await API.get(
        "/notifications"
    );
    return response.data;
};
export const markNotificationAsRead = async(notificationId)=>{
    const response = await API.put(`/notifications/${notificationId}/read`);
    return response.data;
};
export const markAllNotificationsAsRead = async()=>{
    const response = await API.put("/notifications/read-all");
    return response.data;
};