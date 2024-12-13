import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import Masonry from "react-masonry-css";
import { Button } from "antd";
import Link from "next/link";

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
          console.error("Lỗi khi lấy các bài viết đã lưu.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy các bài viết đã lưu:", error);
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
              <PostCardInfinite post={userPost} />
              <Link href={`/update-bai-viet/${userPost._id}`}>
                <Button type="primary" className="w-full">
                  Sửa bài viết
                </Button>
              </Link>
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
