import React from "react";

export default function VideoDoAn() {
  return (
    <div>
      <video
        controls
        autoPlay
        loop
        className="lg:w-96 lg:h-96 md:w-80 md:h-80 w-60 h-60 rounded-2xl cursor-pointer bg-gray-100"
      >
        <source
          src="https://www.tiktok.com/@camera_bro/video/7280169204240698629?is_from_webapp=1&sender_device=pc"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
