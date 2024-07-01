"use client";
import { formatDate } from "@/utils/formatDate";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function BaiViet() {
  const params = useParams();
  const [post, setPost] = useState<IPost>();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/post?id=${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Lỗi khi fetch category:", error);
      }
    }

    fetchPost();
  }, [params.id]);

  if (!post) {
    return <Spin />;
  }

  const data = post.content;

  console.log(post);

  return (
    <div>
      <div className="text-4xl font-semibold">{post.title}</div>
      <div className="mt-5 flex opacity-80 gap-6 text-gray-800">
        <span>
          <UserOutlined className="mr-2" />
          by Review ẩm thực
        </span>
        <span>
          <ClockCircleOutlined className="mr-2" />
          {formatDate(post.createdAt)}
        </span>
        <span>{post.category.name}</span>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: data,
        }}
        className="mt-6"
      />
    </div>
  );
}
