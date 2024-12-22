"use client";
import { useEffect, useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function BookmarkButton({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const userId = session?.user._id;
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BACKEND_URL}/api/bookmark/status?userId=${userId}&postId=${postId}`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${session?.backendTokens.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              "Lỗi khi kiểm tra xem bài viết đã được lưu hay chưa."
            );
          }

          const data = await response.json();
          setBookmarked(data.isBookmarked);
        } catch (error) {
          console.error(
            "Lỗi khi kiểm tra xem bài viết đã được lưu hay chưa:",
            error
          );
        }
      }
    };

    checkIfBookmarked();
  });

  const handleToggleBookmark = async () => {
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/bookmark`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            postId: postId,
          }),
        },
        session
      );

      if (response.ok) {
        setBookmarked(!bookmarked);
        toast.success(
          bookmarked ? "Đã bỏ lưu bài viết" : "Bài viết đã được lưu"
        );
      } else {
        toast.error("Lưu bài viết thất bại.");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra.");
    }
  };

  return (
    <div>
      <span onClick={handleToggleBookmark} className="cursor-pointer">
        {bookmarked ? (
          <FaRegBookmark className="text-2xl text-blue-500" />
        ) : (
          <FaRegBookmark className="text-2xl" />
        )}
      </span>
    </div>
  );
}
