import { useState, useEffect } from "react";
import { CommentOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useSession } from "next-auth/react";
import { formatDate } from "@/utils/formatDate";
import { BACKEND_URL } from "@/lib/constants";
import Image from "next/image";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import Link from "next/link";

const CommentComponent: React.FC<ICommentComponentProps> = ({
  comment,
  onLike,
  onDelete,
}) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<IComment[]>([]);
  const [showFullContent, setShowFullContent] = useState(false);
  const contentPreviewLength = 200;
  const { data: session } = useSession();

  const isLiked = comment.likedBy.includes(session?.user?._id);

  useEffect(() => {
    if (showReplies) {
      const fetchReplies = async () => {
        try {
          const response = await fetch(
            `${BACKEND_URL}/api/comments/replies?parentCommentId=${comment._id}`
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            setReplies(data);
          } else {
            console.error("Replies data is not an array:", data);
          }
        } catch (error) {
          console.error("Error fetching replies:", error);
        }
      };

      fetchReplies();
    }
  }, [showReplies, comment._id]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content: replyContent,
            postId: comment.postId,
            userId: session?.user?._id,
            likes: 0,
            parentCommentId: comment._id,
          }),
        },
        session
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newReply = await response.json();

      setReplies((prevReplies) => [...prevReplies, newReply]);
      setShowReplies(true);
      setReplying(false);
      setReplyContent("");

      comment.replies += 1;
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    const isLiked = replies
      .find((reply) => reply._id === replyId)
      ?.likedBy.includes(session?.user?._id);

    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/comments/${replyId}/like`,
        {
          method: "PATCH",
          body: JSON.stringify({
            replyId,
            userId: session?.user?._id,
            isLiked,
          }),
        },
        session
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === replyId
            ? {
                ...reply,
                likes: isLiked ? reply.likes - 1 : reply.likes + 1,
                likedBy: isLiked
                  ? reply.likedBy.filter((id) => id !== session?.user?._id)
                  : [...reply.likedBy, session?.user?._id],
              }
            : reply
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleReplyDelete = async (replyId: string) => {
    try {
      onDelete(replyId);
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply._id !== replyId)
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  console.log(comment);

  return (
    <div className="border rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <Link href={`/nguoi-dung/${comment.userId?._id}`}>
              <Image
                src={comment.userId?.image || "/profile.jpg"}
                width={40}
                height={40}
                className="rounded-full"
                alt="user-avatar"
              />
            </Link>
            <span className="font-bold">{comment.userId?.name} </span>
            <span className="text-gray-500 text-sm">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <div className="ml-12 mt-1">
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
            <div className="mt-1">
              <button
                onClick={() => setReplying(!replying)}
                className="text-blue-700 font-semibold"
              >
                <CommentOutlined className="mr-1" />
                Trả lời
              </button>
              {comment.replies > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="ml-4 text-blue-700 font-semibold"
                >
                  {showReplies
                    ? `Ẩn ${comment.replies} trả lời`
                    : `Hiện ${comment.replies} trả lời`}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-5 p-6 md:min-w-max">
          <button
            onClick={() => onLike(comment._id)}
            className={`flex flex-col items-center text-gray-400 ${
              isLiked ? "font-bold" : ""
            }`}
          >
            {isLiked ? (
              <HeartFilled className="text-pink-600" />
            ) : (
              <HeartOutlined />
            )}
            {` ${comment.likes}`}
          </button>
          {/* <button
            onClick={() => onDelete(comment._id)}
            className="text-red-500"
          >
            Xóa
          </button> */}
        </div>
      </div>
      {replying && (
        <div className="px-6 pb-6">
          <Input
            className="w-full p-2 border rounded-md"
            onChange={(e) => setReplyContent(e.target.value)}
            value={replyContent}
            onPressEnter={handleReply}
          />
          <button
            onClick={handleReply}
            className="mt-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Bình luận
          </button>
        </div>
      )}
      <div className="ml-4">
        {showReplies &&
          replies.map((reply) => (
            <div key={reply._id} className="ml-8">
              <CommentComponent
                comment={reply}
                onLike={handleReplyLike}
                onDelete={handleReplyDelete}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentComponent;
