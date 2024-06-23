"use client";
import { Button, Dropdown, Layout, MenuProps, Space } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { VscSignOut } from "react-icons/vsc";

const { Header } = Layout;

const items: MenuProps["items"] = [
  {
    label: <Link href="/">Trang chủ</Link>,
    key: "0",
  },
  {
    label: <Link href="/profile">Thông tin</Link>,
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: (
      <button
        onClick={() => signOut()}
        className="flex flex-row items-center gap-6 hover:text-red-600"
      >
        <span>Đăng xuất</span> <VscSignOut />
      </button>
    ),
    key: "3",
  },
];

export default function HomeHeader() {
  const { status, data: session } = useSession();
  return (
    <Header className="flex items-center justify-between border-b-[1px] bg-white top-0 sticky z-10">
      <Button>Home</Button>
      {status === "authenticated" ? (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          arrow={{ pointAtCenter: true }}
          autoAdjustOverflow
          placement="bottomRight"
        >
          <button className="rounded-full" onClick={(e) => e.preventDefault()}>
            <Image
              src={session?.user?.image!}
              width={40}
              height={40}
              alt="user-profile"
              style={{ borderRadius: "50%" }}
            />
          </button>
        </Dropdown>
      ) : (
        <Button onClick={() => signIn("google")}>Login</Button>
      )}
    </Header>
  );
}
