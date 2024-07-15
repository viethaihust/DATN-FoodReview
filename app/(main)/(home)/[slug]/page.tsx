import React from "react";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import HomeCarousel from "../components/HomeCarousel";
import PostList from "../components/PostList";

export default async function MonNgon({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page: string };
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const category = await fetch(BACKEND_URL + `/categories/${params.slug}`)
    .then((res) => res.json())
    .then((data) => data.result as ICategory);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <HomeCarousel params={params.slug} pageType="category" />

      <div className="mt-10">
        <div className="flex gap-2 text-sm opacity-80">
          <Link href={"/"}>Review Ẩm Thực</Link>
          <RightOutlined />
          <Link href={"/mon-ngon-viet-nam"}>Món ngon Việt Nam</Link>
        </div>
        <div className="mt-4 text-4xl font-semibold">{category?.name}</div>
        <div className="mt-6 italic opacity-80">{category?.description}</div>
        <PostList
          params={category?.slug}
          searchParams={searchParams}
          pageType="category"
        />
      </div>
    </div>
  );
}
