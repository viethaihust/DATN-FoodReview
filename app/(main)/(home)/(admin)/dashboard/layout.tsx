"use client";
import React from "react";
import { Layout, Menu } from "antd";
import { ReadOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider, Content } = Layout;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <UserOutlined />,
      label: <Link href="/dashboard">Người dùng</Link>,
    },
    {
      key: "/dashboard/danh-sach-bai-viet",
      icon: <ReadOutlined />,
      label: <Link href="/dashboard/danh-sach-bai-viet">Bài viết</Link>,
    },
  ];

  return (
    <Layout className="h-full">
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
