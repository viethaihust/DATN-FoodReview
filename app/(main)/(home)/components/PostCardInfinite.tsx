import { HeartOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

export default function PostCardInfinite({ post }: { post: IPost }) {
  return (
    <div className="mb-4 h-min break-inside-avoid relative bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100 overflow-hidden">
      <Link href={"/"}>
        <Image
          src={post.image}
          alt={post.title}
          width={350}
          height={350}
          className="w-full h-auto object-cover"
        />
        <div className="pb-0 p-4">
          <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
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
          <span>User name</span>
        </div>
        <span>
          <HeartOutlined className="text-2xl" />
        </span>
      </div>
    </div>
  );
}
