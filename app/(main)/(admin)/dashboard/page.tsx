"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Table, Space, TablePaginationConfig } from "antd";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

const AdminDashboard: React.FC = () => {
  const { status, data: session } = useSession();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/users?page=${page}&pageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${session?.backendTokens.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUsers(data.users);
        setPagination({
          current: data.page,
          pageSize: data.pageSize,
          total: data.total,
        });
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    },
    [session?.backendTokens.accessToken]
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers(pagination.current, pagination.pageSize);
    }
  }, [session, fetchUsers, pagination, status]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const currentPage = pagination.current || 1;
    const pageSize = pagination.pageSize || 10;
    fetchUsers(currentPage, pageSize);
  };

  const handleBan = async (userId: string, action: "ban" | "unban") => {
    const url = `${BACKEND_URL}/api/users/${userId}/${action}`;
    try {
      await fetch(url, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(`Failed to ${action} user`, error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IUser) => (
        <Space size="middle">
          {record.banned ? (
            <a onClick={() => handleBan(record._id, "unban")}>Unban</a>
          ) : (
            <a onClick={() => handleBan(record._id, "ban")}>Ban</a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Table
        columns={columns}
        dataSource={users}
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

export default AdminDashboard;
