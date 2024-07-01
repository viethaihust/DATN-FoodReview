"use client";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NextAuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SessionProvider>
      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              arrowOffset: 20,
              arrowSize: 50,
              dotWidth: 30,
              dotActiveWidth: 40,
            },
          },
        }}
      >
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {children}
      </ConfigProvider>
    </SessionProvider>
  );
};
