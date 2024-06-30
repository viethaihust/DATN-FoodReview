"use client";
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
    </SessionProvider>
  );
};
