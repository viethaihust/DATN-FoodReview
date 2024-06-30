import { Carousel } from "antd";
import React from "react";
import Image from "next/image";
import { ClockCircleOutlined } from "@ant-design/icons";

const contentStyle: React.CSSProperties = {
  height: "400px",
  color: "#fff",
  lineHeight: "400px",
  backgroundColor: "black",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  position: "relative",
};

export default function HomeCarousel() {
  return (
    <div>
      <Carousel autoplay arrows>
        <div className="group cursor-pointer">
          <h3 style={contentStyle}>
            <Image
              src="/thit-trau-gac-bep.jpg"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "100%", opacity: "0.6" }}
              alt="thit-trau-gac-bep"
              className="group-hover:scale-110 transition ease-in-out duration-300"
            />
            <div className="flex flex-col bottom-12 absolute leading-3">
              <div className="group-hover:-translate-y-5 transition ease-in-out duration-300 text-xl font-semibold">
                Nguồn gốc và cách ăn thịt trâu gác bếp đúng điệu
              </div>
              <div className="-mt-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <ClockCircleOutlined className="mr-2"/>
                15 Tháng Năm, 2024
              </div>
            </div>
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </div>
  );
}
