"use client";
import { Inter } from "next/font/google";
import { Layout } from "antd";
import HomeHeader from "./(home)/components/HomeHeader";
import HomeSidebar from "./(home)/components/HomeSidebar";
import { useState } from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <Layout className="min-h-screen">
      <HomeHeader />
      <Layout>
        <HomeSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          className={`bg-white my-[6px] mr-[6px] min-h-full rounded-md transition-margin-left duration-200 ml-[50px] p-5 ${
            collapsed ? "md:ml-[50px]" : "md:ml-[226px]"
          }`}
        >
          {children}
        </Layout>
      </Layout>
    </Layout>
  );
}
