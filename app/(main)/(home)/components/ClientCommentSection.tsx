"use client";

import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import CommentComponent from "./CommentComponent";
import { Input } from "antd";

export default function ClientCommentSection({
  comments = [],
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
      const response = await fetch(`${BACKEND_URL}/api/comments/${id}/like`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?._id,
        }),
      });

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

  const handleReply = (id: string, content: string) => {
    // Implement reply functionality here
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers: {
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
      const response = await fetch(`${BACKEND_URL}/api/comments`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
          postId: postId,
          user: session?.user?._id,
          likes: 0,
        }),
      });

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
    <div>
      <div className="mb-4">
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Viết bình luận..."
        />
        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-700 text-white py-1 px-4 rounded"
        >
          Bình luận
        </button>
      </div>
      {Array.isArray(commentList) &&
        commentList.map((comment) => (
          <CommentComponent
            key={comment._id}
            comment={comment}
            onLike={handleLike}
            onReply={handleReply}
            onDelete={handleDelete}
          />
        ))}
    </div>
  );
}
