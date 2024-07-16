"use client";
import { Button, Drawer, Dropdown, Layout, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { Content, Footer, Header } from "antd/es/layout/layout";
import HomeMenu from "./components/HomeMenu";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VscSignOut } from "react-icons/vsc";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { status, data: session } = useSession();
  const router = useRouter();

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
      <Drawer
        open={open}
        onClose={onClose}
        placement="left"
        width={220}
        className="md:hidden"
        styles={{ body: { padding: 0 } }}
      >
        <HomeMenu onClose={onClose} />
      </Drawer>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={220}
        breakpoint="sm"
        collapsedWidth={50}
        style={{
          backgroundColor: "white",
          position: "fixed",
          overflow: "auto",
          minHeight: "100vh",
        }}
        className="hidden md:block"
      >
        <HomeMenu />
      </Sider>
      <Layout
        className={`min-h-full rounded-md transition-margin-left duration-200 ${
          collapsed ? "md:ml-[50px]" : "md:ml-[220px]"
        }`}
      >
        <Header className="flex items-center justify-between border-b-[1px] bg-white top-0 sticky z-10 px-5 md:px-12">
          <Button onClick={showDrawer} className="md:hidden">
            {open ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </Button>
          <div className="flex items-center ml-auto">
            {session ? (
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
            ) : (
              <Button onClick={() => router.push("/login")}>Login</Button>
            )}
          </div>
        </Header>
        <Content className="bg-white mt-2 md:ml-2 p-5 rounded-lg">
          {children}
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
}
