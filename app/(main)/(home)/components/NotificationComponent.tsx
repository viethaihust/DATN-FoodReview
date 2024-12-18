import useSocket from "@/actions/useSocket";
import { BACKEND_URL } from "@/lib/constants";
import { BellOutlined } from "@ant-design/icons";
import { Dropdown, Badge, MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const NotificationComponent = ({ userId }: { userId: string }) => {
  const socket = useSocket(userId);
  const [notifications, setNotifications] = useState<INotification[]>([]);
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
      socket.on("likeNotification", () => {
        fetchNotifications();
      });
    }

    return () => {
      if (socket) {
        socket.off("likeNotification");
      }
    };
  }, [socket, fetchNotifications]);

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

  console.log("notifications", notifications);

  const notificationMenu: MenuProps["items"] =
    notifications.length > 0
      ? notifications.map((notif, index) => ({
          label: (
            <div className="flex items-center gap-2">
              <Link href={`/nguoi-dung/${notif?.sender._id}`}>
                <Image
                  className="rounded-full h-10 w-10"
                  height={60}
                  width={60}
                  src={notif.sender?.image || "/profile.jpg"}
                  alt="profile-pic"
                />
              </Link>
              <Link
                href={`/dia-diem-review/${notif?.postId._id}`}
                className="hover:text-black"
              >
                <span>{notif.sender.name}</span> <span>{notif.message}</span>{" "}
                <span>&quot;{notif.postId.title}&quot;</span>{" "}
                <span>của bạn!</span>
              </Link>
            </div>
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
      getPopupContainer={() =>
        document.getElementById("sticky-header") as HTMLElement
      }
    >
      <div className="flex items-center cursor-pointer">
        <Badge count={unreadCount}>
          <BellOutlined className="text-2xl" />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationComponent;
