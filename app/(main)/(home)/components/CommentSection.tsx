"use client";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import CommentComponent from "./CommentComponent";
import { Input } from "antd";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import Image from "next/image";

export default function CommentSection({
  comments,
  postId,
}: {
  comments: IComment[];
  postId: string;
}) {
  const [commentList, setCommentList] = useState(comments);
  const [commentText, setCommentText] = useState("");
  const { data: session } = useSession();

  const handleLike = async (id: string) => {
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/comments/${id}/like`,
        {
          method: "PATCH",
          body: JSON.stringify({
            userId: session?.user?._id,
          }),
        },
        session
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedComment = await response.json();

      setCommentList((prevComments) =>
        Array.isArray(prevComments)
          ? prevComments.map((comment) =>
              comment._id === id
                ? {
                    ...comment,
                    likes: updatedComment.likes,
                    likedBy: updatedComment.likedBy,
                  }
                : comment
            )
          : prevComments
      );
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCommentList((prevComments) =>
        Array.isArray(prevComments)
          ? prevComments.filter((comment) => comment._id !== id)
          : prevComments
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content: commentText,
            postId: postId,
            userId: session?.user?._id,
            likes: 0,
          }),
        },
        session
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newComment = await response.json();

      setCommentList((prevComments) =>
        Array.isArray(prevComments)
          ? [...prevComments, newComment]
          : [newComment]
      );
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="mb-5">
        <div className="flex items-center gap-4">
          <Image
            src={session?.user?.image || "/profile.jpg"}
            width={60}
            height={60}
            className="rounded-full min-w-10 object-cover aspect-square"
            alt="profile-pic"
          />
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-3 w-full text-gray-800"
            placeholder="Viết bình luận..."
            onPressEnter={handleAddComment}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            className="mt-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Bình luận
          </button>
        </div>
      </div>
      {Array.isArray(commentList) &&
        commentList.map((comment) => (
          <CommentComponent
            key={comment._id}
            comment={comment}
            onLike={handleLike}
            onDelete={handleDelete}
          />
        ))}
    </div>
  );
}
