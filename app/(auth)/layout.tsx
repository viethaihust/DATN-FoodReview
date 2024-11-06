import { Layout } from "antd";
import AuthBackground from "./components/AuthBackground";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout className="flex items-center justify-center">
      <AuthBackground />
      <Layout className="absolute rounded-[10px] md:w-[25rem] bg-white">
        {children}
      </Layout>
    </Layout>
  );
}
