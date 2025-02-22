"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useSession } from "next-auth/react";

export default function FollowButton({
  userId,
  onFollowToggle,
}: {
  userId: string;
  onFollowToggle?: (isFollowing: boolean) => void;
}) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (session?.user?._id) {
        try {
          const response = await fetchWithAuth(
            `${BACKEND_URL}/api/follows/status?followerId=${session?.user?._id}&followingId=${userId}`,
            { method: "GET" },
            session
          );
          const isFollowing = await response.json();
          if (response.ok) {
            setIsFollowing(isFollowing.isFollowed);
          }
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      }
    };

    if (session?.user?._id !== userId) {
      checkFollowingStatus();
    }
  }, [userId, session]);

  const handleFollowToggle = async () => {
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/follows`,
        {
          method: "POST",
          body: JSON.stringify({
            followerId: session?.user._id,
            followingId: userId,
          }),
        },
        session
      );

      if (response.ok) {
        const updatedStatus = await response.json();
        const newStatus = updatedStatus.isFollowing;
        setIsFollowing(newStatus);
        toast.success(
          newStatus
            ? "Bạn đã theo dõi người dùng này."
            : "Bạn đã bỏ theo dõi người dùng này."
        );

        if (onFollowToggle) {
          onFollowToggle(newStatus);
        }
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <button
      className="py-1 px-4 rounded-sm text-sm border border-solid border-pink-600 text-pink-600 cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-red-600 hover:text-white"
      onClick={handleFollowToggle}
    >
      {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
    </button>
  );
}
