"use client";
import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SearchOutlined, SolutionOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { IoFastFoodOutline } from "react-icons/io5";

const { Sider } = Layout;
export default function HomeSidebar() {
  const pathname = usePathname();

  const sideItems: MenuProps["items"] = [
    {
      key: "/mon-ngon-viet-nam",
      label: <Link href="/mon-ngon-viet-nam">Món ngon Việt Nam</Link>,
      icon: <IoFastFoodOutline />,
    },
    {
      key: "/video-do-an",
      label: <Link href="/video-do-an">Video đồ ăn</Link>,
      icon: <VideoCameraOutlined />,
    },
    {
      key: "/dashboard/patient",
      label: <Link href="/dashboard/patient">Bệnh nhân</Link>,
      icon: <SolutionOutlined />,
    },
    {
      key: "/dashboard/profile",
      label: <Link href="/dashboard/profile">Thông tin cá nhân</Link>,
      icon: <SolutionOutlined />,
    },
  ];

  return (
    <Sider
      width={250}
      style={{
        backgroundColor: "white",
        position: "fixed",
        overflow: "auto",
        height: "100vh",
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={[pathname]}
        items={sideItems}
        className="p-2"
      />
    </Sider>
  );
}
