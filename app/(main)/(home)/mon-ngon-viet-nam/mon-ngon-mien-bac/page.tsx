import React from "react";
import Image from "next/image";
import {
  ClockCircleOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import HomeCarousel from "../../components/HomeCarousel";
import Link from "next/link";

export default function MonNgonVietNam() {
  return (
    <div>
      <HomeCarousel />

      <div className="mt-10">
        <div className="flex gap-2 text-sm opacity-80">
          <Link href={"/"}>Review Ẩm Thực</Link>
          <RightOutlined />
          <Link href={"/mon-ngon-viet-nam"}>Món ngon Việt Nam</Link>
          <RightOutlined />
          <Link
            href={"/mon-ngon-viet-nam/mon-ngon-mien-bac"}
            className="font-semibold"
          >
            Món ngon miền Bắc
          </Link>
        </div>
        <div className="mt-4 text-4xl font-semibold">Món ngon miền Bắc</div>
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
