import React from "react";
import HomeCarousel from "../../components/HomeCarousel";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import PostList from "../../components/PostList";
import { BACKEND_URL } from "@/lib/constants";
import { notFound } from "next/navigation";

export default async function MonNgon({
  params,
  searchParams,
}: {
  params: { subslug: string };
  searchParams: { page: string };
}) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const subCategory = await fetch(
    BACKEND_URL + `/sub-categories/${params.subslug}`
  )
    .then((res) => res.json())
    .then((data) => data.result as ICategory);

  if (!subCategory) {
    notFound();
  }

  return (
    <div>
      <HomeCarousel params={params.subslug} pageType="sub-category" />

      <div className="mt-10">
        <div className="flex gap-2 text-sm opacity-80">
          <Link href={"/"}>Review Ẩm Thực</Link>
          <RightOutlined />
          <Link href={"/mon-ngon-viet-nam"}>Món ngon Việt Nam</Link>
          <RightOutlined />
          <Link
            href={`/mon-ngon-viet-nam/${subCategory?.slug}`}
            className="font-semibold"
          >
            {subCategory?.name}
          </Link>
        </div>
        <div className="mt-4 text-4xl font-semibold">{subCategory?.name}</div>
        <div className="mt-6 italic opacity-80">{subCategory?.description}</div>
        <PostList
          params={subCategory?.slug}
          searchParams={searchParams}
          pageType="sub-category"
        />
      </div>
    </div>
  );
}
