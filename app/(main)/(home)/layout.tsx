"use client";
import { Button, Dropdown, Layout, MenuProps } from "antd";
import { useEffect } from "react";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Image from "next/image";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { VscSignOut } from "react-icons/vsc";
import {
  EditOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import NotificationComponent from "./components/NotificationComponent";
import SearchBar from "./components/SearchBar";
import CreateLocationButton from "./components/CreateLocationButton";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");

  const items: MenuProps["items"] = [
    {
      label: <Link href="/">Trang chủ</Link>,
      key: "0",
    },
    ...(session?.user?.role === "admin"
      ? [
          {
            label: <Link href="/dashboard">Dashboard</Link>,
            key: "1",
          },
        ]
      : []),
    {
      label: <Link href="/thong-tin-ca-nhan">Thông tin</Link>,
      key: "2",
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
          className="flex flex-row items-center gap-6 hover:text-red-600 px-3 py-1"
        >
          <span>Đăng xuất</span> <VscSignOut />
        </button>
      ),
      key: "3",
      style: { padding: 0 },
    },
  ];

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
    <Layout className="min-h-screen" hasSider>
      <Layout className="min-h-full rounded-md">
        <Header
          id="sticky-header"
          className="flex items-center justify-between border-b-[1px] bg-white top-0 sticky z-10 px-5 md:px-12"
        >
          <div className="mr-10">
            <Link href="/">
              <Image
                src="/logo.jpg"
                width={60}
                height={60}
                alt="logo"
                className="cursor-pointer"
              />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <SearchBar />
            <Link href="/viet-bai-review">
              <Button
                className="rounded-md bg-gradient-to-r from-[#ff6700] to-[#ff9d00] text-white font-semibold px-4 py-5 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center"
                icon={<EditOutlined className="text-lg" />}
              >
                Viết bài review
              </Button>
            </Link>
            <CreateLocationButton />
          </div>
          <div className="flex items-center ml-auto mr-5">
            {session ? (
              <div className="flex gap-10">
                <NotificationComponent userId={session.user?._id} />
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  arrow={{ pointAtCenter: true }}
                  autoAdjustOverflow
                  placement="bottomRight"
                >
                  <button
                    className="rounded-full"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Image
                      src={session?.user?.image || "/profile.jpg"}
                      width={40}
                      height={40}
                      alt="user-profile"
                      style={{ borderRadius: "50%" }}
                    />
                  </button>
                </Dropdown>
              </div>
            ) : (
              <Button onClick={() => router.push("/login")}>Đăng nhập</Button>
            )}
          </div>
        </Header>
        <Content
          className={`bg-white mt-2 rounded-lg ${isDashboardPage ? "" : "p-5"}`}
        >
          {children}
        </Content>
        {!isDashboardPage && (
          <Footer className="relative mt-auto">
            <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">FoodReview</h2>
              </div>
              <div>
                <div className="flex gap-5">
                  <FacebookOutlined style={{ fontSize: "30px" }} />
                  <TwitterOutlined style={{ fontSize: "30px" }} />
                  <InstagramOutlined style={{ fontSize: "30px" }} />
                </div>
              </div>
            </div>
            <div className="mt-5 text-center text-gray-500">
              © 2024 VuVietHai. All rights reserved.
            </div>
          </Footer>
        )}
      </Layout>
    </Layout>
  );
}
