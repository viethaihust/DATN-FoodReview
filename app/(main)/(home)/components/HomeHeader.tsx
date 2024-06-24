"use client";
import { Button, Dropdown, Layout, MenuProps, Spin } from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { VscSignOut } from "react-icons/vsc";
import { toast } from "react-toastify";

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
        onClick={() => {
          signOut();
          localStorage.setItem("toastShown", "false");
        }}
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
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      const isToastShown = localStorage.getItem("toastShown");
      if (!isToastShown || isToastShown === "false") {
        toast.success("Đăng nhập thành công");
        localStorage.setItem("toastShown", "true");
      }
    }
  }, [status, session]);

  return (
    <Header className="flex items-center justify-between border-b-[1px] bg-white top-0 sticky z-10">
      <Button>Home</Button>
      {status && status === "loading" ? (
        <Spin />
      ) : status === "authenticated" ? (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          arrow={{ pointAtCenter: true }}
          autoAdjustOverflow
          placement="bottomRight"
        >
          <button className="rounded-full" onClick={(e) => e.preventDefault()}>
            <Image
              src={session?.user?.image || "/profile.jpg"}
              width={40}
              height={40}
              alt="user-profile"
              style={{ borderRadius: "50%" }}
            />
          </button>
        </Dropdown>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </Header>
  );
}
