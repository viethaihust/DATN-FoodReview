import { useEffect, useState } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function PostCardInfinite({
  post,
  userId,
}: {
  post: IReviewPost;
  userId: string | undefined;
}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/like-posts/status?userId=${userId}&postId=${post._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch like status");
          }
          const data = await response.json();
          setLiked(data.liked);
          console.log(data.liked);
        } catch (error) {
          console.error("Error checking if post is liked:", error);
        }
      }
    };
    checkIfLiked();
  }, [userId, post._id]);

  const handleLikePost = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/like-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          postId: post._id,
        }),
      });

      if (response.ok) {
        setLiked(true);
        toast.success("Post liked successfully!");
      } else {
        toast.error("Failed to like post.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handleUnlikePost = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/like-posts/unlike",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            postId: post._id,
          }),
        }
      );

      if (response.ok) {
        setLiked(false);
        toast.success("Post unliked successfully!");
      } else {
        toast.error("Failed to unlike post.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="mb-4 h-min break-inside-avoid relative bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100 overflow-hidden">
      <Link href={`/bai-viet/${post._id}`}>
        <Image
          src={post.images[0]}
          alt={post.title}
          width={350}
          height={350}
          className="w-full h-auto object-cover"
        />
        <div className="pb-0 p-4">
          <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
        </div>
      </Link>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-5">
          <Image
            src={"/profile.jpg"}
            width={40}
            height={40}
            alt="user-profile"
            style={{ borderRadius: "50%" }}
          />
          <span>User name</span>
        </div>
        <span
          onClick={liked ? handleUnlikePost : handleLikePost}
          className="cursor-pointer"
        >
          {liked ? (
            <HeartFilled className="text-2xl text-red-500" />
          ) : (
            <HeartOutlined className="text-2xl" />
          )}
        </span>
      </div>
    </div>
  );
}
