import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationServices";
import toast from "react-hot-toast";
export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadNotifications = async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const response = await getNotifications();

        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      } catch (error) {
        console.log(error);

        if (showLoading) {
          toast.error(
            error.response?.data?.message || "Failed to load notifications",
          );
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    // Initial load
    loadNotifications(true);

    // Check for new notifications every 5 seconds
    const interval = setInterval(() => {
      loadNotifications(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await markNotificationAsRead(notification.id);
      }
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                is_read: true,
              }
            : item,
        ),
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to mark notifications",
      );
    }
  };
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );

      setUnreadCount(0);

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error(error);

      toast.error("Unable to mark notifications as read");
    }
  };
  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-xl transition hover:bg-orange-100"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4">
            <div>
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Mark all read
              </button>
            )}
          </div>
          {/* Body */}
          <div className="max-h-112.5 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl">🔔</div>
                <p className="mt-3 font-semibold text-gray-700">
                  No notifications
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full border-b border-gray-100 px-5 py-4 text-left transition hover:bg-orange-50 ${
                    !notification.is_read ? "bg-orange-50/60" : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="text-xl">
                      {notification.type === "ORDER"
                        ? "🛒"
                        : notification.type === "SUBSCRIPTION"
                          ? "📅"
                          : notification.type === "COMPLAINT"
                            ? "⚠️"
                            : notification.type === "REVIEW"
                              ? "⭐"
                              : "🔔"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
