import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";

export default function BaiViet({ params }: { params: { id: string } }) {
  const data = '<div style="transform: none;">Example Content</div>';
  return (
    <div>
      <div className="text-4xl font-semibold">
        Hướng dẫn cách làm gà nướng muối ớt thơm ngon, đơn giản tại nhà
      </div>
      <div className="mt-5 flex opacity-80 gap-6 text-gray-800">
        <span>
          <UserOutlined className="mr-2" />
          by Review ẩm thực
        </span>
        <span>
          <ClockCircleOutlined className="mr-2" />
          29 Tháng Năm
        </span>
        <span>Món ăn miền Bắc</span>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: data,
        }}
        className="mt-6"
      />
    </div>
  );
}
