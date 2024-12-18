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

  if (!post) {
    notFound();
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
                  <MapModal
                    destination={post.locationId.latLong}
                    locationName={post.locationId.name}
                    locationAddress={post.locationId.address}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
            <div>{post.likesCount} lượt thích</div>
            <LikeButton postId={post._id} />
            <BookmarkButton postId={post._id} />
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
        <div>
          <div className="text-3xl font-semibold">{post.title}</div>
          <div className="text-gray-800 text-xl font-sans mt-5">
            {post.content}
          </div>
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
                  href={`/dia-diem-review/${randomPost._id}`}
                  className="group hover:text-black"
                >
                  <div className="rounded-md border">
                    <Image
                      height={100}
                      width={100}
                      src={randomPost.images[0]}
                      alt="profile-pic"
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
                        {randomPost.content.length > 100
                          ? randomPost.content.slice(0, 100) + "..."
                          : randomPost.content}
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
