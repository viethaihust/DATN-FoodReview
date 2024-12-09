"use client";
import { useEffect, useState } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";

export default function LikeButton({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const [liked, setLiked] = useState(false);
  const router = useRouter();

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
  }, [userId, postId]);

  const handleToggleLikePost = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/like-posts`, {
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
        setLiked(!liked);
        router.refresh();
      } else {
        toast.error("Thích bài viết thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
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
