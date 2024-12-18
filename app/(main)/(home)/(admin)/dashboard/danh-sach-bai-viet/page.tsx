"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Table, TablePaginationConfig, Button, Modal } from "antd";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

const ReviewPostList: React.FC = () => {
  const { status, data: session } = useSession();
  const [posts, setPosts] = useState<IReviewPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPosts = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/review-posts?page=${page}&pageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const result = await response.json();
        setPosts(result.data.posts);
        if (
          pagination.current !== pagination.current ||
          pagination.pageSize !== pagination.pageSize
        ) {
          setPagination({
            current: result.data.page,
            pageSize: result.data.pageSize,
            total: result.data.totalPosts,
          });
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination]
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts(pagination.current, pagination.pageSize);
    }
  }, [status, fetchPosts, pagination]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const currentPage = pagination.current || 1;
    const pageSize = pagination.pageSize || 10;
    fetchPosts(currentPage, pageSize);
  };

  const handleDelete = async (postId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa bài viết",
      content: "Bạn có chắc chắn muốn xóa bài viết này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await fetch(
            `${BACKEND_URL}/api/review-posts/${postId}`,
            {
              method: "DELETE",
              headers: {
                authorization: `Bearer ${session?.backendTokens.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            fetchPosts(pagination.current, pagination.pageSize);
            toast.success("Xóa bài viết thành công");
          } else {
            toast.error("Lỗi khi xóa bài viết");
          }
        } catch (error) {
          console.error(`Failed to delete post with ID ${postId}:`, error);
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => <Link href={`/dia-diem-review/${id}`}>{id}</Link>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Thể loại",
      dataIndex: ["categoryId", "name"],
      key: "categoryId.name",
    },
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              width={50}
              height={50}
              className="object-cover rounded-md"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: IReviewPost) => (
        <Button size="middle" danger onClick={() => handleDelete(record._id)}>
          Xóa bài viết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey={(record) => record._id}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ReviewPostList;
