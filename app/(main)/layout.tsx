import { Inter } from "next/font/google";
import { Layout } from "antd";
import HomeHeader from "./(home)/components/HomeHeader";
import HomeSidebar from "./(home)/components/HomeSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <HomeHeader />
      <Layout>
        <HomeSidebar />
        <Layout className="ml-[250px] p-5">{children}</Layout>
      </Layout>
    </Layout>
  );
}
