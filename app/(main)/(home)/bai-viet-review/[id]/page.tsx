import { Carousel, Rate } from "antd";
import Image from "next/image";
import "./Carousel.css";
import CommentSection from "../../components/CommentSection";
import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import LikeButton from "../../components/LikeButton";
import BookmarkButton from "../../components/BookmarkButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FollowButton from "../../components/FollowButton";
import MapModalButton from "../../components/MapModalButton";
import SimilarPosts from "../../components/SimilarPosts";

export default async function BaiVietReview({
  params,
}: {
  params: { id: string };
}) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const session = await getServerSession(authOptions);

  const post = await fetch(`${BACKEND_URL}/api/review-posts/${params.id}`, {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((result) => result.data as IReviewPost);

  if (!post) {
    notFound();
  }

  if (session?.user?._id) {
    await fetchWithAuth(
      `${BACKEND_URL}/api/viewed`,
      {
        method: "POST",
        body: JSON.stringify({
          postId: params.id,
          userId: session.user._id,
        }),
      },
      session
    );
  }

  const comments = await fetch(
    `${BACKEND_URL}/api/comments?postId=${params.id}`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  return (
    <div className="flex flex-wrap justify-between md:gap-10">
      <div className="flex-grow w-full md:w-1/2 md:px-5">
        <div className="flex flex-row justify-between -mx-4">
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href={`/nguoi-dung/${post?.userId._id}`}>
              <Image
                className="hover:shadow-sm hover:shadow-slate-400 rounded-full object-cover aspect-square"
                height={60}
                width={60}
                src={post.userId.image || "/profile.jpg"}
                alt="profile-pic"
              />
            </Link>
            <div className="w-full">
              <div className="flex items-center gap-2">
                <div className="font-bold">{post.userId.name}</div>
                {session?.user?._id !== post.userId._id && (
                  <div>
                    <FollowButton userId={post.userId._id} />
                  </div>
                )}
              </div>
              <div className="lg:flex mt-1 items-center gap-2">
                <div className="lg:flex mb-1">
                  <span>{formatDate(post?.createdAt)} tại&nbsp;</span>
                  <Link href={`/dia-diem-review/${post.locationId._id}`}>
                    <span className="text-orange-600 lg:flex">
                      <span>{post.locationId.name}</span>
                      <span className="hidden md:block">
                        {" "}
                        - {post.locationId.address}
                      </span>
                    </span>
                  </Link>
                </div>
                <MapModalButton destination={post?.locationId?.latLong} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-5 ml-2 text-center">
            <div id={`like-count-${post._id}`}>
              {post.likesCount}{" "}
              <span className="hidden md:!block">lượt thích</span>
            </div>
            <LikeButton postId={post._id} />
            <BookmarkButton postId={post._id} />
          </div>
        </div>
        <div className="pt-5 -mx-5">
          {post.files.length > 1 ? (
            <Carousel arrows>
              {post.files.map((file, index) => (
                <div key={index} className="h-[20rem] md:h-[35rem]">
                  {file.endsWith(".mp4") ||
                  file.endsWith(".mov") ||
                  file.endsWith(".mpeg") ? (
                    <video
                      className="h-full w-auto object-cover m-auto"
                      controls
                      src={file}
                    />
                  ) : (
                    <Image
                      height={200}
                      width={200}
                      src={file}
                      alt="review-pic"
                      className="h-full w-auto object-contain m-auto"
                    />
                  )}
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="h-[20rem] md:h-[35rem]">
              {post.files[0].endsWith(".mp4") ||
              post.files[0].endsWith(".mov") ||
              post.files[0].endsWith(".mpeg") ? (
                <video
                  className="h-full w-auto object-cover m-auto"
                  controls
                  src={post.files[0]}
                />
              ) : (
                <Image
                  height={200}
                  width={200}
                  src={post.files[0]}
                  alt="review-pic"
                  className="h-full w-auto object-contain m-auto"
                />
              )}
            </div>
          )}
        </div>
        <div className="mt-10 px-2">
          <div>
            <Rate
              allowHalf
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
        <div className="mt-5">
          <div className="text-3xl font-semibold">{post.title}</div>
          <div
            className="text-gray-800 text-xl font-sans mt-5 ql-editor"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>
        <div className="pt-5">
          <CommentSection comments={comments} postId={post._id} />
        </div>
      </div>
      <SimilarPosts postId={post._id} />
    </div>
  );
}
