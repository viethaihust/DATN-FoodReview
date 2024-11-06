"use client";
import { useEffect, useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";

export default function BookmarkButton({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const userId = session?.user._id;
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter();

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
  }, [userId, postId]);

  const handleToggleBookmark = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookmark`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          postId: postId,
        }),
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
        toast.success(
          bookmarked ? "Đã bỏ lưu bài viết" : "Bài viết đã được lưu"
        );
        router.refresh();
      } else {
        toast.error("Lưu bài viết thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
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
