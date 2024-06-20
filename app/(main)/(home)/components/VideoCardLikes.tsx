"use client"
import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { FaCommentDots, FaShare } from "react-icons/fa";

export default function VideoCardLikes() {
  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  return (
    <div className="relative mr-[75px]">
      <div className="absolute bottom-0 pl-2">
        <div className="pb-4 text-center">
          <button
            disabled={hasClickedLike}
            className="rounded-full bg-gray-200 p-2 cursor-pointer"
          >
            {!hasClickedLike ? (
              <AiFillHeart color={"#ff2626"} size="25" />
            ) : (
              <BiLoaderCircle className="animate-spin" size="25" />
            )}
          </button>
          <span className="text-xs text-gray-800 font-semibold">13</span>
        </div>

        <button className="pb-4 text-center">
          <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
            <FaCommentDots size="25" />
          </div>
          <span className="text-xs text-gray-800 font-semibold">25</span>
        </button>

        <button className="text-center">
          <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
            <FaShare size="25" />
          </div>
          <span className="text-xs text-gray-800 font-semibold">55</span>
        </button>
      </div>
    </div>
  );
}
