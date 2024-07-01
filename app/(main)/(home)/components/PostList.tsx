import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Pagination } from "antd";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";

const PostList = ({ params }: { params: string }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(
          `/api/post?categoryName=${params}&page=${currentPage}&pageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
      } catch (error) {
        console.error("Lỗi khi fetch category:", error);
      }
    }

    fetchPosts();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-10 max-w-[60rem] items-center">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div className="flex w-full md:flex-row flex-col gap-10" key={post._id}>
            <div className="flex justify-center items-center">
              <Image
                src={post.image}
                alt={post.title}
                width={350}
                height={0}
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
                <Link href={`/mon-ngon-viet-nam/bai-viet/${post._id}`}>
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
      {posts && posts.length > 0 && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalPosts}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PostList;
