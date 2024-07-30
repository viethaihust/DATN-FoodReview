import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { ImMusic } from "react-icons/im";
import VideoCardLikes from "./VideoCardLikes";
import Image from "next/image";

export default function VideoCard() {
  return (
    <div>
      <div className="flex border-b py-6 justify-center">
        <div className="cursor-pointer">
          <Image
            className="rounded-full"
            height={60}
            width={60}
            src="/profile.jpg"
            alt="profile-pic"
          />
        </div>
        <div className="pl-3 px-4">
          <div className="flex items-center justify-between pb-0.5 max-w-80">
            <span className="font-bold hover:underline cursor-pointer">
              hello
            </span>

            <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
              Follow
            </button>
          </div>
          <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
            hello
          </p>
          <p className="text-[14px] text-gray-500 pb-0.5">
            #fun #cool #SuperAwesome
          </p>
          <p className="text-[14px] pb-0.5 flex items-center font-semibold">
            <ImMusic size="17" />
            <span className="px-1">original sound - AWESOME</span>
            <AiFillHeart size="20" />
          </p>

          <div className="mt-2.5 flex">
            <div className="relative min-h-[250px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
              <video
                controls
                loop
                className="lg:w-96 lg:h-96 md:w-80 md:h-80 w-60 h-60 rounded-2xl cursor-pointer bg-gray-100"
              >
                <source
                  src="https://res.cloudinary.com/dllxrab3l/video/upload/v1719818448/dvgcmupnojcus6aqm4jf.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <VideoCardLikes />
          </div>
        </div>
      </div>
      <div className="flex border-b py-6 justify-center">
        <div className="cursor-pointer">
          <Image
            className="rounded-full"
            height={60}
            width={60}
            src="/profile.jpg"
            alt="profile-pic"
          />
        </div>
        <div className="pl-3 px-4">
          <div className="flex items-center justify-between pb-0.5 max-w-80">
            <span className="font-bold hover:underline cursor-pointer">
              hello
            </span>

            <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
              Follow
            </button>
          </div>
          <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
            hello
          </p>
          <p className="text-[14px] text-gray-500 pb-0.5">
            #fun #cool #SuperAwesome
          </p>
          <p className="text-[14px] pb-0.5 flex items-center font-semibold">
            <ImMusic size="17" />
            <span className="px-1">original sound - AWESOME</span>
            <AiFillHeart size="20" />
          </p>

          <div className="mt-2.5 flex">
            <div className="relative min-h-[250px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
              <video
                controls
                loop
                className="lg:w-96 lg:h-96 md:w-80 md:h-80 w-60 h-60 rounded-2xl cursor-pointer bg-gray-100"
              >
                <source
                  src="https://res.cloudinary.com/dllxrab3l/video/upload/v1719818448/dvgcmupnojcus6aqm4jf.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <VideoCardLikes />
          </div>
        </div>
      </div>
    </div>
  );
}
