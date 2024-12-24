import { Carousel, Rate } from "antd";
import Image from "next/image";
import "./Carousel.css";
import CommentSection from "../../components/CommentSection";
import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import LikeButton from "../../components/LikeButton";
import BookmarkButton from "../../components/BookmarkButton";
import MapModal from "../../components/MapModal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FollowButton from "../../components/FollowButton";

export default async function DiaDiemReview({
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

  const randomPosts = await fetch(
    `${BACKEND_URL}/api/review-posts/random?excludedPostId=${params.id}`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

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
                className="hover:shadow-sm hover:shadow-slate-400 rounded-full object-contain"
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
              <div className="mt-1">
                <span>{formatDate(post?.createdAt)} tại&nbsp;</span>
                <span className="text-orange-600 hover:cursor-pointer">
                  <MapModal
                    destination={post?.locationId?.latLong}
                    locationName={post?.locationId?.name}
                    locationAddress={post?.locationId?.address}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-5 ml-2 text-center">
            <div id={`like-count-${post._id}`}>
              {post.likesCount} lượt thích
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
            className="text-gray-800 text-xl font-sans mt-5"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>
        <div className="pt-5">
          <CommentSection comments={comments} postId={post._id} />
        </div>
      </div>
      {randomPosts && randomPosts.length > 0 ? (
        <div className="md:max-w-[20rem]">
          <div className="text-xl font-semibold underline decoration-orange-500 underline-offset-8">
            Các bài viết khác
          </div>
          <div className="flex flex-col mt-5 gap-6">
            {randomPosts.map((randomPost: IReviewPost) => (
              <div key={randomPost._id} className="rounded-md border">
                <Link
                  href={`/bai-viet-review/${randomPost._id}`}
                  className="group hover:text-black"
                >
                  <div className="rounded-md border">
                    <Image
                      height={100}
                      width={100}
                      src={
                        randomPost?.files[0].replace(".mp4", ".jpg") ||
                        "/fallback-video.jpg"
                      }
                      alt="random-post-pic"
                      className="w-full max-h-52 rounded-t-md object-cover"
                    />
                    <div className="flex flex-col gap-1 p-4">
                      <div className="flex flex-wrap">
                        <div className="opacity-80">
                          {formatDate(randomPost.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Rate
                            allowHalf
                            disabled
                            value={randomPost.ratings.overall}
                            style={{ color: "orange" }}
                          />
                          <span className="ml-5">
                            <strong className="text-xl">
                              {randomPost.ratings.overall}{" "}
                            </strong>
                            /5 điểm
                          </span>
                        </div>
                      </div>
                      <div className="group-hover:text-orange-600">
                        <span className="text-lg font-semibold">
                          {randomPost.title}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 hover:text-black">
                          <Image
                            className="rounded-full h-12 w-12"
                            height={60}
                            width={60}
                            src={randomPost?.userId.image || "/profile.jpg"}
                            alt="profile-pic"
                          />
                          <span>{randomPost?.userId.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
