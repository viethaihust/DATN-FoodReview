import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import { Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CommentComponent: React.FC<ICommentComponentProps> = ({
  comment,
  onLike,
  onReply,
  onDelete,
}) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showFullContent, setShowFullContent] = useState(false);
  const contentPreviewLength = 100;
  const { data: session } = useSession();

  const isLiked = comment.likedBy.includes(session?.user?._id);

  const handleReply = () => {
    onReply(comment._id, replyContent);
    setReplying(false);
    setReplyContent("");
  };

  return (
    <div className="border rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <div className="p-6">
          <h4 className="font-bold">{comment.user?.name}</h4>
          <p>
            {showFullContent || comment.content.length <= contentPreviewLength
              ? comment.content
              : `${comment.content.slice(0, contentPreviewLength)}...`}
          </p>
          {comment.content.length > contentPreviewLength && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-500"
            >
              {showFullContent ? "Hiện ít hơn" : "Xem thêm"}
            </button>
          )}
          <p className="text-gray-500 text-sm">
            {formatDate(comment.createdAt)}
          </p>
        </div>
        <div className="flex gap-2 p-6 w-32 md:min-w-max">
          <button
            onClick={() => onLike(comment._id)}
            className={`text-blue-500 ${isLiked ? "font-bold" : ""}`} // Highlight if liked
          >
            {isLiked
              ? `Đã thích (${comment.likes})`
              : `Thích (${comment.likes})`}
          </button>
          <button
            onClick={() => setReplying(!replying)}
            className="text-blue-500"
          >
            Trả lời
          </button>
          <button
            onClick={() => onDelete(comment._id)}
            className="text-red-500"
          >
            Xóa
          </button>
        </div>
      </div>
      {replying && (
        <div className="px-6 pb-6">
          <TextArea
            rows={2}
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setReplyContent(e.target.value)}
            value={replyContent}
          />
          <button
            onClick={handleReply}
            className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
          >
            Trả lời
          </button>
        </div>
      )}
      <div className="ml-4">
        {comment.replies.map((reply) => (
          <CommentComponent
            key={reply._id}
            comment={reply}
            onLike={onLike}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const params = useParams();
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          BACKEND_URL + `/comments?postId=${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    }

    fetchComments();
  }, [params.id]);

  const handleLike = async (id: string) => {
    try {
      const response = await fetch(BACKEND_URL + `/comments/${id}/like`, {
        method: "PATCH",
        headers: {
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

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === id
            ? {
                ...comment,
                likes: updatedComment.likes,
                likedBy: updatedComment.likedBy,
              }
            : comment
        )
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
      const response = await fetch(BACKEND_URL + `/comments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(BACKEND_URL + "/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
          postId: params.id,
          user: session?.user?._id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newComment = await response.json();

      setComments((prevComments) => [...prevComments, newComment]);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loadingComments) {
    return <Spin />;
  }

  return (
    <div>
      <div className="mb-4">
        <TextArea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Viết bình luận..."
        />
        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
        >
          Bình luận
        </button>
      </div>
      {comments.map((comment) => (
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
};

export default CommentSection;
