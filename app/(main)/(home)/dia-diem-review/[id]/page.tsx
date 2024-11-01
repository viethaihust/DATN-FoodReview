import { Carousel, Rate } from "antd";
import Image from "next/image";
import React from "react";
import "./Carousel.css";
import { FaRegBookmark } from "react-icons/fa";
import ServerCommentSection from "../../components/ServerCommentSection";
import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import LikeButton from "../../components/LikeButton";

export default async function DiaDiemReview({
  params,
}: {
  params: { id: string };
}) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const post = await fetch(`${BACKEND_URL}/api/review-posts/${params.id}`, {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((result) => result.data as IReviewPost);

  return (
    <div className="flex flex-wrap justify-between md:gap-10">
      <div className="flex-grow w-full md:w-1/2 md:px-5">
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-6">
            <Image
              className="cursor-pointer hover:shadow-sm hover:shadow-slate-400 rounded-full"
              height={60}
              width={60}
              src="/profile.jpg"
              alt="profile-pic"
            />
            <div>
              <div className="font-bold">{post.userId.name}</div>
              <div>
                <span>{formatDate(post.createdAt)} tại&nbsp;</span>
                <span className="text-orange-600 hover:cursor-pointer">
                  {post.address}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
            <div>{post.likesCount} lượt thích</div>
            <LikeButton postId={post._id} />
            <FaRegBookmark className="text-xl md:text-2xl" />
          </div>
        </div>
        <div className="pt-5 -mx-5">
          <Carousel arrows>
            {post.images.map((image, index) => (
              <div key={index} className="h-[20rem] md:h-[35rem]">
                <Image
                  height={200}
                  width={200}
                  src={image}
                  alt="profile-pic"
                  className="h-full w-auto object-contain m-auto"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="pt-5 px-2">
          <div>
            <Rate
              disabled
              value={post.ratings.overall}
              style={{ color: "orange" }}
            />
            <span className="ml-5">
              <strong className="text-xl">{post.ratings.overall} </strong>/5
              điểm
            </span>
          </div>
          <div className="flex flex-row gap-2 mt-2 opacity-80">
            <div>Hương vị: {post.ratings.flavor}</div>
            <div>Không gian: {post.ratings.space}</div>
            <div>Vệ sinh: {post.ratings.hygiene}</div>
            <div>Giá cả: {post.ratings.price}</div>
            <div>Phục vụ: {post.ratings.serves}</div>
          </div>
        </div>
        <div>
          <div className="text-3xl font-semibold">{post.title}</div>
          <div className="text-gray-800 text-xl font-sans mt-5">
            {post.content}
          </div>
        </div>
        <div className="pt-5">
          <ServerCommentSection postId="66816b7e53fb66017848c5cb" />
        </div>
      </div>
      <div className="md:max-w-[20rem]">
        <div className="text-xl font-semibold underline decoration-orange-500 underline-offset-8">
          Bài viết tương tự
        </div>
        <div className="flex flex-col mt-5 gap-6">
          <div className="rounded-md border">
            <Image
              height={200}
              width={200}
              src="/mon-an-trung-quoc.jpg"
              alt="profile-pic"
              className="w-full rounded-t-md"
            />
            <div className="flex flex-col gap-1 p-5">
              <div className="flex flex-wrap gap-5">
                <div className="opacity-80">06/15/2024</div>
                <div className="flex items-center">
                  <Rate
                    disabled
                    value={5}
                    style={{ color: "orange", fontSize: 15 }}
                  />
                  <span className="ml-2">
                    <strong>5.0 </strong>/5 điểm
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold">
                LẨU RIÊU CUA TÓP MỠ !!
              </div>
              <div>
                Nhân một ngày mát trời được bạn dẫn đi thẩm lẩu real quán quen
                của nó. Hàng này thì không gian rộng rãi...
              </div>
              <div className="underline text-xl font-semibold">Xem thêm</div>
            </div>
          </div>
          <div className="rounded-md border">
            <Image
              height={200}
              width={200}
              src="/mon-an-trung-quoc.jpg"
              alt="profile-pic"
              className="w-full rounded-t-md"
            />
            <div className="flex flex-col gap-1 p-5">
              <div className="flex flex-row gap-5">
                <div className="opacity-80">06/15/2024</div>
                <div>
                  <Rate
                    disabled
                    value={5}
                    style={{ color: "orange", fontSize: 15 }}
                  />
                  <span className="ml-2">
                    <strong>5.0 </strong>/5 điểm
                  </span>
                </div>
              </div>
              <div className="text-md font-semibold">
                LẨU RIÊU CUA TÓP MỠ !!
              </div>
              <div>
                Nhân một ngày mát trời được bạn dẫn đi thẩm lẩu real quán quen
                của nó. Hàng này thì không gian rộng rãi...
              </div>
              <div className="underline text-xl font-semibold">Xem thêm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
