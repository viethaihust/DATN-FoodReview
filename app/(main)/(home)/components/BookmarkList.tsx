import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import Masonry from "react-masonry-css";

const BookmarkList = ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/bookmark?userId=${userId}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data);
        } else {
          console.error("Lỗi khi lấy các bài viết đã lưu.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy các bài viết đã lưu:", error);
      }
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId, accessToken]);

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-4 px-5"
        columnClassName="bg-clip-padding"
      >
        {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
          bookmarks.every(({ postId }) => !postId) ? (
            <p>Không có bài viết nào</p>
          ) : (
            bookmarks.map(({ postId }) =>
              postId ? (
                <div key={postId._id} className="mb-4 break-inside-avoid">
                  <PostCardInfinite
                    post={postId}
                    onPostDelete={(postId: string) => {
                      setBookmarks((prevPosts) =>
                        prevPosts.filter((p) => p._id !== postId)
                      );
                    }}
                  />
                </div>
              ) : null
            )
          )
        ) : (
          <p>Không có bài viết nào</p>
        )}
      </Masonry>
    </div>
  );
};

export default BookmarkList;
