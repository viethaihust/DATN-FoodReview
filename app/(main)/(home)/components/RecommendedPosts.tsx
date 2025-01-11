"use client";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import Masonry from "react-masonry-css";

export default function RecommendedPosts() {
  const { data: session } = useSession();
  const [recommendedPosts, setRecommendedPosts] = useState<IReviewPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecommendedPosts() {
      try {
        setLoading(true);
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

    if (session?.user?._id) {
      fetchRecommendedPosts();
    }
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
  };

  return (
    <div>
      <div className="text-xl mt-5 font-semibold underline decoration-orange-500 underline-offset-8">
        Bài viết có thể bạn sẽ thích
      </div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto mt-5 md:mt-0 -mx-4 gap-2 md:gap-4 md:p-5"
        columnClassName="bg-clip-padding"
      >
        {recommendedPosts.map((post) => (
          <PostCardInfinite key={post._id} post={post} />
        ))}
      </Masonry>
    </div>
  );
}
