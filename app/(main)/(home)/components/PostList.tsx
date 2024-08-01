import React from "react";
import Image from "next/image";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import { BACKEND_URL } from "@/lib/constants";
import PostPagination from "./PostPagination";

export default async function PostList({
  params,
  pageType,
  searchParams,
}: {
  params: string;
  pageType: string;
  searchParams?: { page: string };
}) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 5;

  let url = `${BACKEND_URL}/api/posts?page=${page}&pageSize=${pageSize}`;
  if (pageType === "category") {
    url += `&categorySlug=${params}`;
  } else if (pageType === "sub-category") {
    url += `&subCategorySlug=${params}`;
  }

  const response = await fetch(url)
    .then((res) => res.json())
    .then((data) => data.result);

  const posts = response?.posts as IPost[];
  const totalPosts = response?.totalPosts;

  return (
    <div className="mt-10 flex flex-col gap-10 max-w-[60rem] items-center">
      {posts ? (
        posts.map((post) => (
          <div
            className="flex w-full md:flex-row flex-col gap-10"
            key={post._id}
          >
            <div className="flex justify-center items-center">
              <Image
                src={post.image}
                alt={post.title}
                width={350}
                height={350}
                className="max-w-[350px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xl font-semibold">{post.title}</div>
              <div className="flex opacity-80 gap-6 text-gray-800">
                <span>
                  <UserOutlined className="mr-2" />
                  by Review ẩm thực
                </span>
                <span>
                  <ClockCircleOutlined className="mr-2" />
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <div>{post.summary}</div>
              <div>
                <Link href={`/bai-viet/${post._id}`}>
                  <Button className="bg-gray-500 text-white font-semibold rounded">
                    ĐỌC THÊM
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>Không có bài viết nào</div>
      )}
      {posts && posts?.length > 0 && <PostPagination total={totalPosts} />}
    </div>
  );
}
