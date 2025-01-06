"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Table, TablePaginationConfig, Button } from "antd";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Pagination {
  current: number;
  pageSize: number;
}

const AdminDashboard: React.FC = () => {
  const { status, data: session } = useSession();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 5,
  });
  const [total, setTotal] = useState<number>(0);

  const fetchUsers = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(
          `${BACKEND_URL}/api/users?page=${page}&pageSize=${pageSize}`,
          {
            method: "GET",
          },
          session
        );
        const data = await response.json();
        setTotal(data.total);
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers(pagination.current, pagination.pageSize);
    }
  }, [pagination, status, fetchUsers]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const current = newPagination.current || 1;
    const pageSize = newPagination.pageSize || pagination.pageSize;

    setPagination((prev) => ({
      ...prev,
      current,
      pageSize,
    }));
  };

  const handleBan = async (userId: string, action: "ban" | "unban") => {
    const url = `${BACKEND_URL}/api/users/${userId}/${action}`;
    try {
      await fetchWithAuth(
        url,
        {
          method: "PATCH",
        },
        session
      );
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(`Failed to ${action} user`, error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => <Link href={`/nguoi-dung/${id}`}>{id}</Link>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image
          src={image || "/profile.jpg"}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full min-w-12 object-cover aspect-square"
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: IUser) =>
        record.role === "admin" ? null : (
          <Button
            size="middle"
            onClick={() =>
              handleBan(record._id, record.banned ? "unban" : "ban")
            }
          >
            {record.banned ? "Bỏ khóa tài khoản" : "Khóa tài khoản"}
          </Button>
        ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default AdminDashboard;
