import { Layout, Spin } from "antd";
import AuthBackground from "./components/AuthBackground";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout className="flex items-center justify-center">
      <AuthBackground />
      <Layout className="absolute rounded-[10px] md:w-[25rem] bg-white">
        <Suspense fallback={<Spin />}>{children}</Suspense>
      </Layout>
    </Layout>
  );
}
