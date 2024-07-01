"use client";
import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { SolutionOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { IoFastFoodOutline } from "react-icons/io5";

const { Sider } = Layout;
export default function HomeSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const pathname = usePathname();

  const sideItems: MenuProps["items"] = [
    {
      key: "/mon-ngon-viet-nam",
      label: "Món ngon Việt Nam",
      icon: <IoFastFoodOutline />,
      children: [
        {
          key: "mon-ngon-mien-bac",
          label: (
            <Link href="/mon-ngon-viet-nam/mon-ngon-mien-bac">
              Món ngon miền Bắc
            </Link>
          ),
        },
        {
          key: "mon-ngon-mien-nam",
          label: (
            <Link href="/mon-ngon-viet-nam/mon-ngon-mien-nam">
              Món ngon miền Nam
            </Link>
          ),
        },
        {
          key: "mon-ngon-mien-trung",
          label: (
            <Link href="/mon-ngon-viet-nam/mon-ngon-mien-trung">
              Món ngon miền Trung
            </Link>
          ),
        },
      ],
    },
    {
      key: "/mon-ngon-the-gioi",
      label: "Món ngon thế giới",
      icon: <SolutionOutlined />,
      children: [
        {
          key: "mon-ngon-han-quoc",
          label: <Link href="/mon-ngon-han-quoc">Món ngon Hàn Quốc</Link>,
        },
        {
          key: "mon-ngon-nhat-ban",
          label: <Link href="/mon-ngon-nhat-ban">Món ngon Nhật Bản</Link>,
        },
        {
          key: "mon-ngon-trung-quoc",
          label: <Link href="/mon-ngon-trung-quoc">Món ngon Trung Quốc</Link>,
        },
      ],
    },
    {
      key: "/video-do-an",
      label: <Link href="/video-do-an">Video đồ ăn</Link>,
      icon: <VideoCameraOutlined />,
    },
    {
      key: "/nau-an",
      label: <Link href="/nau-an">Nấu ăn</Link>,
      icon: <SolutionOutlined />,
    },
  ];

  return (
    <div className="relative z-10">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={220}
        breakpoint="sm"
        collapsedWidth={40}
        style={{
          backgroundColor: "white",
          position: "fixed",
          overflow: "auto",
          minHeight: "100vh",
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={sideItems}
          className="p-2"
          style={{ flex: "auto", padding: 0, margin: 0 }}
        />
      </Sider>
    </div>
  );
}
