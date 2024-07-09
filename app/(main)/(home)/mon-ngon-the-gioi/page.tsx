"use client";
import React from "react";
import Image from "next/image";
import HomeCarousel from "../components/HomeCarousel";
import {
  ClockCircleOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MonNgonTheGioi() {
  const pathname = usePathname();
  const path = pathname.split("/").filter(Boolean).pop();
  
  return (
    <div>
      <HomeCarousel params={path!} />

      <div className="mt-10">
        <div className="flex gap-2 text-sm opacity-80">
          <Link href={"/"}>Review Ẩm Thực</Link>
          <RightOutlined />
          <Link href={"/mon-ngon-the-gioi"} className="font-semibold">
            Món ngon thế giới
          </Link>
        </div>
        <div className="mt-4 text-4xl font-semibold">Món ngon thế giới</div>
        <div className="mt-6 italic opacity-80">
          Việt Nam có nền ẩm thực đa dạng và phong phú, mỗi miền lại có những
          món ăn đặc trưng riêng. Ẩm thực miền Bắc thường thanh đạm, nhẹ nhàng
          với hương vị tinh tế. Các món nổi tiếng bao gồm phở Hà Nội, bún chả,
          bún thang, bánh cuốn Thanh Trì, chả cá Lã Vọng và cốm làng Vòng. Miền
          Trung với hương vị đậm đà, cay nồng, nổi bật với các món như bún bò
          Huế, mì Quảng, bánh bèo, bánh nậm, bánh bột lọc và cao lầu Hội An. Ẩm
          thực miền Nam lại phong phú với sự hòa quyện của nhiều hương vị, ngọt,
          mặn, chua và cay. Các món ăn nổi bật gồm có hủ tiếu Nam Vang, cơm tấm,
          bánh xèo, lẩu mắm, gỏi cuốn và bún mắm. Mỗi miền có cách chế biến và
          gia vị riêng biệt, tạo nên sự đa dạng và hấp dẫn trong ẩm thực Việt
          Nam.
        </div>
        <div className="mt-10 flex flex-col gap-10 w-[60rem]">
          <div className="flex w-full">
            <div>
              <Image
                src="/thit-trau-gac-bep.jpg"
                width={500}
                height={500}
                alt="thit-trau-gac-bep"
              />
            </div>
            <div className="flex ml-10 flex-col gap-2">
              <div className="text-xl font-semibold">
                Gà nướng mắc khén - Món ngon làm bữa cơm gia đình thêm hấp dẫn
              </div>
              <div className="flex opacity-80 gap-6 text-gray-800">
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
              <div>
                Học hỏi ngay món gà nướng mắc khén Tây Bắc da giòn thịt mềm, đậm
                đà hương vị núi rừng...
              </div>
              <div>
                <Button className="bg-gray-500 text-white font-semibold rounded">
                  ĐỌC THÊM
                </Button>
              </div>
            </div>
          </div>
          <div className="flex w-full">
            <div>
              <Image
                src="/thit-trau-gac-bep.jpg"
                width={500}
                height={500}
                alt="thit-trau-gac-bep"
              />
            </div>
            <div className="ml-10">
              <div className="text-xl font-semibold">
                Gà nướng mắc khén - Món ngon làm bữa cơm gia đình thêm hấp dẫn
              </div>
            </div>
          </div>
          <div className="flex w-full">
            <div>
              <Image
                src="/thit-trau-gac-bep.jpg"
                width={500}
                height={500}
                alt="thit-trau-gac-bep"
              />
            </div>
            <div className="ml-10">
              <div className="text-xl font-semibold">
                Gà nướng mắc khén - Món ngon làm bữa cơm gia đình thêm hấp dẫn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
