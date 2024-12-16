import Image from "next/image";
import Link from "next/link";
import LikeButton from "./LikeButton";
import { Button, Dropdown, MenuProps, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";

export default function PostCardInfinite({
  post,
  onPostDelete,
}: {
  post: IReviewPost;
  onPostDelete: (postId: string) => void;
}) {
  const { data: session } = useSession();

  const items: MenuProps["items"] = [
    {
      label: (
        <Link href={`/update-bai-viet/${post._id}`}>
          <Button type="primary" className="w-full">
            Sửa bài viết
          </Button>
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Button
          type="default"
          danger
          onClick={() => {
            Modal.confirm({
              title: "Xác nhận xóa bài viết",
              content: "Bạn có chắc chắn muốn xóa bài viết này không?",
              okText: "Xóa",
              cancelText: "Hủy",
              onOk: async () => {
                try {
                  const response = await fetch(
                    `${BACKEND_URL}/api/review-posts/${post._id}`,
                    {
                      method: "DELETE",
                      headers: {
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (response.ok) {
                    onPostDelete(post._id);
                    toast.success("Xóa bài viết thành công");
                  } else {
                    toast.error("Lỗi khi xóa bài viết");
                  }
                } catch (error) {
                  console.error("Lỗi khi xóa bài viết:", error);
                  toast.error("Lỗi kết nối tới máy chủ");
                }
              },
            });
          }}
          className="w-full"
        >
          Xóa bài viết
        </Button>
      ),
      key: "1",
    },
  ];

  return (
    <div className="mb-4 h-min break-inside-avoid relative bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100 overflow-hidden">
      {session?.user?._id === post.userId._id && (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className="absolute top-3 right-3 text-black w-8 h-8"
        >
          <Button onClick={(e) => e.preventDefault()}>
            <MenuOutlined style={{ fontSize: "18px" }} />
          </Button>
        </Dropdown>
      )}
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
