"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export default function HomeBanner() {
  const target = useRef(null);

  useEffect(() => {
    if (target.current) {
      gsap.set(target.current, { visibility: "visible" });
      const text = new SplitType(target.current);
      gsap.from(text.chars, {
        yPercent: -50,
        opacity: 0,
        stagger: {
          amount: 2,
        },
      });
    }
  }, [target]);

  return (
    <div className="max-h-[30rem] overflow-hidden relative">
      <Image
        src="/home-banner.jpg"
        alt="home-banner"
        width={500}
        height={500}
        style={{ width: "100%", objectFit: "cover" }}
      ></Image>
      <div className="absolute inset-0 flex items-center left-10 md:left-40 mr-10">
        <div ref={target} className="text-sm flex flex-col text-white gap-6 font-bold">
          <div className="text-sm md:text-8xl">Review Ẩm Thực</div>
          <div className="md:text-4xl italic">
            Khám phá hương vị, trải nghiệm văn hóa
          </div>
          <button className="rounded-2xl border-2 border-dashed border-black bg-orange-300 px-3 py-1 md:px-6 md:py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_#fb923c] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
}
