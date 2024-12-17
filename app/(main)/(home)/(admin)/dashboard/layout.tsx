"use client";
import React from "react";
import { Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";

const { Sider, Content } = Layout;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="h-full">
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse}>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link href="/dashboard">Người dùng</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ReadOutlined />}>
            <Link href={"/dashboard/danh-sach-bai-viet"}>Bài viết</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
