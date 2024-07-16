import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl text-gray-600 mb-8">Không tìm thấy trang</h2>
      <div>
        <Link href="/">Trở về trang chủ</Link>
      </div>
    </div>
  );
}
