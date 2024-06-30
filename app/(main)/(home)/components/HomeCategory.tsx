import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomeCategory() {
  return (
    <div className="mt-10">
      <div>Món ăn Việt Nam</div>
      <div className="mt-6 flex flex-row gap-10 px-10">
        <div className="group relative overflow-hidden rounded-md">
          <Link href="/mon-ngon-viet-nam/mon-ngon-mien-bac">
            <Image
              src="/mon-an-mien-bac.jpg"
              alt="mon-an-mien-bac"
              width={500}
              height={500}
              className="group-hover:scale-105 transition ease-in-out duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-700 opacity-0 group-hover:opacity-60 transition duration-300"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="mb-4 group-hover:translate-y-4 group-hover:opacity-100 opacity-0 transition ease-in-out duration-300 text-xl font-semibold text-white">
                Món ăn miền Bắc
              </div>
            </div>
          </Link>
        </div>
        <div className="group relative overflow-hidden rounded-md">
          <Link href="/mon-ngon-viet-nam/mon-ngon-mien-trung">
            <Image
              src="/mon-an-mien-trung.jpg"
              alt="mon-an-mien-trung"
              width={500}
              height={500}
              className="group-hover:scale-105 transition ease-in-out duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-700 opacity-0 group-hover:opacity-60 transition duration-300"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="mb-4 group-hover:translate-y-4 group-hover:opacity-100 opacity-0 transition ease-in-out duration-300 text-xl font-semibold text-white">
                Món ăn miền Trung
              </div>
            </div>
          </Link>
        </div>
        <div className="group relative overflow-hidden rounded-md">
          <Link href="/mon-ngon-viet-nam/mon-ngon-mien-nam">
            <Image
              src="/mon-an-mien-nam.jpg"
              alt="mon-an-mien-nam"
              width={500}
              height={500}
              className="group-hover:scale-105 transition ease-in-out duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-700 opacity-0 group-hover:opacity-60 transition duration-300"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="mb-4 group-hover:translate-y-4 group-hover:opacity-100 opacity-0 transition ease-in-out duration-300 text-xl font-semibold text-white">
                Món ăn miền Nam
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
