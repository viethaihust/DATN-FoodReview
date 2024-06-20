import { Inter } from "next/font/google";
import { Layout } from "antd";
import AuthBackground from "./components/AuthBackground";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.className}>
        <Layout className="flex items-center justify-center">
          <AuthBackground />
          <Layout className="absolute rounded-[10px] w-[25rem] bg-white">{children}</Layout>
        </Layout>
      </body>
    </html>
  );
}
