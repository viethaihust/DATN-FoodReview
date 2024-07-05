"use client";
import React from "react";
import { RightOutlined } from "@ant-design/icons";
import HomeCarousel from "../../components/HomeCarousel";
import Link from "next/link";
import PostList from "../../components/PostList";
import { usePathname } from "next/navigation";

export default function MonNgonTrungQuoc() {
  const pathname = usePathname();
  const path = pathname.split("/").filter(Boolean).pop();
  
  return (
    <div>
      <HomeCarousel params={path!}/>

      <div className="mt-10">
        <div className="flex gap-2 text-sm opacity-80">
          <Link href={"/"}>Review Ẩm Thực</Link>
          <RightOutlined />
          <Link href={"/mon-ngon-viet-nam"}>Món ngon thế giới</Link>
          <RightOutlined />
          <Link
            href={"/mon-ngon-viet-nam/mon-ngon-mien-bac"}
            className="font-semibold"
          >
            Món ngon Trung Quốc
          </Link>
        </div>
        <div className="mt-4 text-4xl font-semibold">Món ngon Trung Quốc</div>
        <div className="mt-6 italic opacity-80">
          Miền Bắc Việt Nam nổi tiếng với nhiều món ăn đặc trưng, phong phú và
          hấp dẫn. Dưới đây là một số món ngon miền Bắc bạn không nên bỏ qua.
          Phở Hà Nội là món ăn quốc hồn quốc túy của Việt Nam với nước dùng thơm
          ngon từ xương bò hoặc gà, kèm bánh phở mềm, thịt bò hoặc gà thái mỏng,
          hành lá và các loại gia vị. Bún chả là món ăn gồm bún, thịt heo nướng,
          rau sống, và nước chấm đặc biệt làm từ nước mắm, đường, giấm, và tỏi
          ớt. Chả cá Lã Vọng là món cá chiên được ướp với nghệ và thì là, ăn kèm
          với bún, bánh đa nem, lạc rang, và các loại rau thơm. Bún thang là món
          bún gồm thịt gà xé, trứng gà thái sợi, giò lụa, tôm khô, nấm hương và
          nước dùng trong vắt, thơm ngon. Nem rán còn gọi là chả giò, là món ăn
          gồm nhân thịt heo, tôm, miến, mộc nhĩ, cà rốt, hành, và được cuốn
          trong bánh đa nem rồi rán giòn.
        </div>
        <PostList params={path!} />
      </div>
    </div>
  );
}
