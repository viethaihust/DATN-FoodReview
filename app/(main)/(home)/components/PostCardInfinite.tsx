import Image from "next/image";
import Link from "next/link";
import LikeButton from "./LikeButton";

export default function PostCardInfinite({ post }: { post: IReviewPost }) {
  return (
    <div className="mb-4 h-min break-inside-avoid relative bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100 overflow-hidden">
      <Link href={`/dia-diem-review/${post?._id}`}>
        <Image
          src={post?.images[0]}
          alt={post?.title}
          width={350}
          height={350}
          className="w-full h-auto object-cover"
        />
        <div className="pb-0 p-4">
          <h2 className="text-lg font-bold text-gray-800">{post?.title}</h2>
          <p className="text-gray-600 mb-2">
            {post.content.length > 100
              ? post.content.slice(0, 100) + "..."
              : post.content}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-5">
          <Image
            src={"/profile.jpg"}
            width={40}
            height={40}
            alt="user-profile"
            style={{ borderRadius: "50%" }}
          />
          <span>{post?.userId.name}</span>
        </div>
        <LikeButton postId={post?._id} />
      </div>
    </div>
  );
}
