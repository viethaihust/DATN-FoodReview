import { Menu, MenuProps } from "antd";
import Link from "next/link";
import React from "react";
import {
  HomeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export default function HomeMenu({ onClose }: { onClose?: () => void }) {
  const sideItems: MenuProps["items"] = [
    {
      key: "/",
      label: (
        <Link href="/" onClick={onClose}>
          Trang chủ
        </Link>
      ),
      icon: <HomeOutlined />,
    },
    {
      key: "/video-do-an",
      label: (
        <Link href="/video-do-an" onClick={onClose}>
          Video đồ ăn
        </Link>
      ),
      icon: <VideoCameraOutlined />,
    },
  ];

  return (
    <Menu
      mode="inline"
      items={sideItems}
      className="p-2"
      style={{ flex: "auto", padding: 0, margin: 0 }}
    />
  );
}
