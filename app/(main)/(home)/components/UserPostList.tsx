import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import Masonry from "react-masonry-css";

const UserPostList = ({ userId }: { userId: string }) => {
  const [userPosts, setUserPosts] = useState<IReviewPost[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/review-posts?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setUserPosts(result.data.posts);
        } else {
          console.error("Lỗi khi lấy các bài viết.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy các bài viết:", error);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

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
        {Array.isArray(userPosts) && userPosts.length > 0 ? (
          userPosts.map((userPost) => (
            <div key={userPost._id} className="mb-4 break-inside-avoid">
              <PostCardInfinite
                post={userPost}
                onPostDelete={(postId: string) => {
                  setUserPosts((prevPosts) =>
                    prevPosts.filter((p) => p._id !== postId)
                  );
                }}
              />
            </div>
          ))
        ) : (
          <p>Không có bài viết nào</p>
        )}
      </Masonry>
    </div>
  );
};

export default UserPostList;
