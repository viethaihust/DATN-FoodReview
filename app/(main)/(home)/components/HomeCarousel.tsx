import { Carousel } from "antd";
import React from "react";
import Image from "next/image";
import { ClockCircleOutlined } from "@ant-design/icons";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/constants";

export default async function HomeCarousel({
  params,
  pageType,
}: {
  params: string;
  pageType: string;
}) {
  let url = `${BACKEND_URL}/posts?random=true`;
  if (pageType === "category") {
    url += `&categorySlug=${params}`;
  } else if (pageType === "sub-category") {
    url += `&subCategorySlug=${params}`;
  }

  const posts = await fetch(url)
    .then((res) => res.json())
    .then((data) => data.result?.randomPosts as IPost[]);

  return (
    <div>
      {posts && (
        <Carousel arrows>
          {posts.map((post) => (
            <div key={post._id}>
              <div className="h-[250px] md:h-[450px] text-white leading-[400px] bg-black backdrop-blur-sm relative px-28">
                <Link
                  href={`/bai-viet/${post._id}`}
                  className="w-full flex justify-center"
                >
                  <Image
                    src={post.image}
                    width={350}
                    height={350}
                    style={{ opacity: "0.6" }}
                    alt="thit-trau-gac-bep"
                    className="w-full"
                  />
                  <div className="group text-white flex flex-col bottom-8 md:bottom-12 absolute leading-3 px-10">
                    <div className="group-hover:-translate-y-5 group-hover:text-[#fbc747] transition ease-in-out duration-300 text-xl font-semibold">
                      {post.title}
                    </div>
                    <div className="hidden md:block -mt-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <ClockCircleOutlined className="mr-2" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}
