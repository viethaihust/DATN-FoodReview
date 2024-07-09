import { Carousel } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ClockCircleOutlined } from "@ant-design/icons";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";

export default function HomeCarousel({ params }: { params: string }) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        let url = `${BACKEND_URL}/posts?random=true`;
        if (params !== "mon-ngon-viet-nam" && params !== "mon-ngon-the-gioi") {
          url = `${BACKEND_URL}/posts?categoryName=${params}&random=true`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.result.randomPosts);
      } catch (error) {
        console.error("Lỗi khi fetch category:", error);
      }
    }

    fetchPosts();
  }, [params]);

  return (
    <div>
      <Carousel autoplay arrows>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div className="group overflow-hidden" key={post._id}>
              <h3 className="h-[500px] text-white leading-[400px] bg-black backdrop-blur-sm flex justify-center relative">
                <Image
                  src={post.image}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ opacity: "0.6" }}
                  alt="thit-trau-gac-bep"
                  className="group-hover:scale-105 transition ease-in-out duration-300 object-cover w-full mx-28"
                />
                <div className="flex flex-col bottom-12 absolute leading-3 px-10">
                  <Link
                    href={`/bai-viet/${post._id}`}
                    className="hover:text-[#fbc747]"
                  >
                    <div className="group-hover:-translate-y-5 transition ease-in-out duration-300 text-xl font-semibold">
                      {post.title}
                    </div>
                  </Link>
                  <div className="-mt-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <ClockCircleOutlined className="mr-2" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </h3>
            </div>
          ))
        ) : (
          <div>Không có bài viết nào</div>
        )}
      </Carousel>
    </div>
  );
}
