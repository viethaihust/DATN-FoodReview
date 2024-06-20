import React from "react";
import Image from "next/image";

export default function AuthBackground() {
  return (
    <div className="w-screen h-screen">
      <Image
        src="/background.jpg"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "100%", objectFit: "cover"}}
        alt="background"
      />
    </div>
  );
}
