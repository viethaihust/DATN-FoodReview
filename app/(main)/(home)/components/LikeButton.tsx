"use client";
import { useEffect, useState } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function LikeButton({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BACKEND_URL}/api/like-posts/status?userId=${userId}&postId=${postId}`,
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
              "Lỗi khi kiểm tra xem bài viết đã được thích hay chưa."
            );
          }
          const data = await response.json();
          setLiked(data.liked);
        } catch (error) {
          console.error(
            "Lỗi khi kiểm tra xem bài viết đã được thích hay chưa:",
            error
          );
        }
      }
    };
    checkIfLiked();
  }, [userId, postId, session]);

  const handleToggleLikePost = async () => {
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/like-posts`,
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
        setLiked(!liked);
        const likeCountElement = document.getElementById(
          `like-count-${postId}`
        );
        if (likeCountElement) {
          likeCountElement.innerText = `${
            liked
              ? parseInt(likeCountElement.innerText) - 1
              : parseInt(likeCountElement.innerText) + 1
          } lượt thích`;
        }
      } else {
        toast.error("Thích bài viết thất bại.");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra.");
    }
  };

  return (
    <div>
      <span onClick={handleToggleLikePost} className="cursor-pointer">
        {liked ? (
          <HeartFilled className="text-2xl text-red-500" />
        ) : (
          <HeartOutlined className="text-2xl" />
        )}
      </span>
    </div>
  );
}
