import useSocket from "@/actions/useSocket";
import { BACKEND_URL } from "@/lib/constants";
import { BellOutlined } from "@ant-design/icons";
import { Dropdown, Badge, MenuProps } from "antd";
import { ok } from "assert";
import { read } from "fs";
import React, { useCallback, useEffect, useState } from "react";
import { json } from "stream/consumers";

const NotificationComponent = ({ userId }: { userId: string }) => {
  const socket = useSocket(userId);
  const [notifications, setNotifications] = useState<
    { message: string; read: boolean }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/notification?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((notif: any) => !notif.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (socket) {
      socket.on("likeNotification", (data) => {
        setNotifications((prev) => [
          { message: data.message, read: false },
          ...prev,
        ]);
        setUnreadCount((prevCount) => prevCount + 1);
      });
    }
  }, [socket]);

  const handleDropdownOpen = async (open: boolean) => {
    if (open) {
      await fetchNotifications();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);

      await fetch(
        `${BACKEND_URL}/api/notification/markAsRead?userId=${userId}`,
        {
          method: "POST",
        }
      );
    }
  };

  const notificationMenu: MenuProps["items"] =
    notifications.length > 0
      ? notifications.map((notif, index) => ({
          label: (
            <span className={notif.read ? "text-gray-500" : "text-black"}>
              {notif.message}
            </span>
          ),
          key: index.toString(),
        }))
      : [
          {
            label: (
              <span className="text-gray-500">Không có thông báo nào</span>
            ),
            key: "no-notifications",
          },
        ];

  return (
    <Dropdown
      menu={{ items: notificationMenu }}
      trigger={["click"]}
      onOpenChange={handleDropdownOpen}
    >
      <div className="flex items-center relative cursor-pointer">
        <Badge count={unreadCount}>
          <BellOutlined className="text-2xl" />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationComponent;
