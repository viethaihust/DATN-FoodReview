"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Spin } from "antd";
import Masonry from "react-masonry-css";
import { removeHtmlTags } from "@/utils/removeHtmlTags";
import LikeButton from "./LikeButton";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";

export default function RecommendedPosts() {
  const { data: session } = useSession();
  const [recommendedPosts, setRecommendedPosts] = useState<IReviewPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendedPosts() {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/recommendation/for-user/${session?.user?._id}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setRecommendedPosts(data || []);
      } catch (error) {
        console.error("Failed to fetch recommended posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendedPosts();
  }, [session?.user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spin size="large" />
      </div>
    );
  }

  if (
    !session?.user?._id ||
    !recommendedPosts.length ||
    recommendedPosts.length === 0
  ) {
    return null;
  }

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div>
      <div className="text-xl mt-5 font-semibold underline decoration-orange-500 underline-offset-8">
        Bài viết có thể bạn sẽ thích
      </div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-4 p-5"
        columnClassName="bg-clip-padding"
      >
        {recommendedPosts.map((post) => (
          <div
            key={post?._id}
            className="mb-4 h-min break-inside-avoid relative bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100 overflow-hidden"
          >
            <Link href={`/bai-viet-review/${post?._id}`}>
              <Image
                src={
                  post?.files[0].replace(".mp4", ".jpg") ||
                  "/fallback-video.jpg"
                }
                alt={post?.title}
                width={350}
                height={350}
                className="w-full h-auto object-cover"
              />
              <div className="pb-0 p-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {post?.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {post.content.length > 100 ? (
                    <>
                      <span>{removeHtmlTags(post.content.slice(0, 100))}</span>
                      ...
                    </>
                  ) : (
                    <span>{removeHtmlTags(post.content)}</span>
                  )}
                </p>
              </div>
            </Link>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-5">
                <Link
                  href={`/nguoi-dung/${post?.userId._id}`}
                  className="flex items-center gap-2 hover:text-orange-600"
                >
                  <Image
                    src={post.userId.image || "/profile.jpg"}
                    width={40}
                    height={40}
                    alt="user-profile"
                    className="rounded-full w-8 h-8"
                  />
                  <span>{post?.userId.name}</span>
                </Link>
              </div>
              <LikeButton postId={post?._id} />
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
