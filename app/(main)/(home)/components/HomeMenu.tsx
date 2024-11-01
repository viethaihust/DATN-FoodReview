import { Menu, MenuProps } from "antd";
import Link from "next/link";
import React from "react";
import {
  HomeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { IoMdStar } from "react-icons/io";
import { TbWorld } from "react-icons/tb";

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
      key: "/mon-ngon-viet-nam",
      label: "Món ngon Việt Nam",
      icon: <IoMdStar />,
      children: [
        {
          key: "/mon-ngon-viet-nam/mon-ngon-mien-bac",
          label: (
            <Link href="/mon-ngon-viet-nam/mon-ngon-mien-bac" onClick={onClose}>
              Món ngon miền Bắc
            </Link>
          ),
        },
        {
          key: "mon-ngon-mien-nam",
          label: (
            <Link href="/mon-ngon-viet-nam/mon-ngon-mien-nam" onClick={onClose}>
              Món ngon miền Nam
            </Link>
          ),
        },
        {
          key: "mon-ngon-mien-trung",
          label: (
            <Link
              href="/mon-ngon-viet-nam/mon-ngon-mien-trung"
              onClick={onClose}
            >
              Món ngon miền Trung
            </Link>
          ),
        },
      ],
    },
    {
      key: "/mon-ngon-the-gioi",
      label: "Món ngon thế giới",
      icon: <TbWorld />,
      children: [
        {
          key: "mon-ngon-han-quoc",
          label: (
            <Link href="/mon-ngon-the-gioi/mon-ngon-han-quoc" onClick={onClose}>
              Món ngon Hàn Quốc
            </Link>
          ),
        },
        {
          key: "mon-ngon-nhat-ban",
          label: (
            <Link href="/mon-ngon-the-gioi/mon-ngon-nhat-ban" onClick={onClose}>
              Món ngon Nhật Bản
            </Link>
          ),
        },
        {
          key: "mon-ngon-trung-quoc",
          label: (
            <Link
              href="/mon-ngon-the-gioi/mon-ngon-trung-quoc"
              onClick={onClose}
            >
              Món ngon Trung Quốc
            </Link>
          ),
        },
      ],
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
