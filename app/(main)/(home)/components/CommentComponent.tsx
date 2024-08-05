"use client";
import { formatDate } from "@/utils/formatDate";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const CommentComponent: React.FC<ICommentComponentProps> = ({
  comment,
  onLike,
  onReply,
  onDelete,
}) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showFullContent, setShowFullContent] = useState(false);
  const contentPreviewLength = 200;
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
          <div>
            <span className="font-bold">{comment.user?.name} </span>
            <span className="text-gray-500 text-sm">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <div>
            {showFullContent || comment.content.length <= contentPreviewLength
              ? comment.content
              : `${comment.content.slice(0, contentPreviewLength)}...`}
            {comment.content.length > contentPreviewLength && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-blue-700 pl-2"
              >
                {showFullContent ? "Hiện ít hơn" : "Xem thêm"}
              </button>
            )}
          </div>
          <div>
            <button
              onClick={() => setReplying(!replying)}
              className="text-blue-700"
            >
              Trả lời
            </button>
          </div>
        </div>
        <div className="flex gap-5 p-6 w-32 md:min-w-max">
          <button
            onClick={() => onLike(comment._id)}
            className={`flex flex-col items-center text-gray-400 ${
              isLiked ? "font-bold" : ""
            }`}
          >
            {isLiked ? <HeartFilled className="text-pink-600" /> : <HeartOutlined />}
            {` ${comment.likes}`}
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
            className="mt-2 bg-blue-700 text-white p-2 rounded-lg"
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

export default CommentComponent;
