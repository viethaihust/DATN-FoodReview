"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Rate, Spin } from "antd";
import { formatDate } from "@/utils/formatDate";

export default function SimilarPosts({ postId }: { postId: string }) {
  const [similarPosts, setSimilarPosts] = useState<IReviewPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarPosts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommendation/similar-posts/${postId}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setSimilarPosts(data || []);
      } catch (error) {
        console.error("Failed to fetch similar posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSimilarPosts();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spin size="large" />
      </div>
    );
  }

  if (!similarPosts.length || similarPosts.length === 0) {
    return null;
  }

  return (
    <div className="md:max-w-[15rem] lg:max-w-[20rem]">
      <div className="text-xl font-semibold underline decoration-orange-500 underline-offset-8">
        Bài viết tương tự
      </div>
      <div className="flex flex-col mt-5 gap-6">
        {similarPosts.map((similarPost) => (
          <div key={similarPost._id} className="rounded-md border">
            <Link
              href={`/bai-viet-review/${similarPost._id}`}
              className="group hover:text-black"
            >
              <div className="rounded-md border">
                <Image
                  height={100}
                  width={100}
                  src={
                    similarPost?.files[0].replace(".mp4", ".jpg") ||
                    "/fallback-video.jpg"
                  }
                  alt="similar-post-pic"
                  className="w-full rounded-t-md object-cover"
                />
                <div className="flex flex-col gap-1 p-4">
                  <div className="flex flex-wrap">
                    <div className="opacity-80">
                      {formatDate(similarPost.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Rate
                        allowHalf
                        disabled
                        value={similarPost.ratings.overall}
                        style={{ color: "orange" }}
                      />
                      <span className="ml-5">
                        <strong className="text-xl">
                          {similarPost.ratings.overall}
                        </strong>
                        /5 điểm
                      </span>
                    </div>
                  </div>
                  <div className="group-hover:text-orange-600">
                    <span className="text-lg font-semibold">
                      {similarPost.title}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 hover:text-black">
                      <Image
                        className="rounded-full object-cover min-w-8 aspect-square"
                        height={50}
                        width={50}
                        src={similarPost?.userId.image || "/profile.jpg"}
                        alt="profile-pic"
                      />
                      <span>{similarPost?.userId.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
