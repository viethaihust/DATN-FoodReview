"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Table, TablePaginationConfig, Button, Modal } from "antd";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

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
        setPagination((prev) => ({
          ...prev,
          total: result.data.totalPosts,
        }));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts(pagination.current, pagination.pageSize);
    }
  }, [status, fetchPosts, pagination.current, pagination.pageSize]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || prev.pageSize,
    }));
    fetchPosts(
      newPagination.current || 1,
      newPagination.pageSize || pagination.pageSize
    );
  };

  const handleDelete = async (postId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa bài viết",
      content: "Bạn có chắc chắn muốn xóa bài viết này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await fetchWithAuth(
            `${BACKEND_URL}/api/review-posts/${postId}`,
            {
              method: "DELETE",
            },
            session
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
      dataIndex: "files",
      render: (files: string[]) => (
        <div className="flex gap-2">
          {files.map((file, index) => {
            const isVideo = file.includes("video");
            const imageUrl = isVideo ? file.replace(".mp4", ".jpg") : file;

            return (
              <Image
                key={index}
                src={imageUrl || "/fallback-video.jpg"}
                alt={`Preview ${index + 1}`}
                width={50}
                height={50}
                className="object-cover rounded-md"
              />
            );
          })}
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
