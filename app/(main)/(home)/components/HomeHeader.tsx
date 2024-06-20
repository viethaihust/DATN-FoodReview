"use client";
import { Button, Layout } from "antd";
import React from "react";
const { Header } = Layout;
export default function HomeHeader() {
  return (
    <Header className="flex items-center justify-between border-b-[1px] bg-white top-0 sticky z-10">
      <Button>Home</Button>
      
    </Header>
  );
}
