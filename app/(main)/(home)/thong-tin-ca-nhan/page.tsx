"use client";
import { CameraOutlined } from "@ant-design/icons";
import { Tabs, TabsProps, Upload, UploadProps } from "antd";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import BookmarkList from "../components/BookmarkList";
import UserPostList from "../components/UserPostList";
import { useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { data: session, update } = useSession();

  const [userPosts, setUserPosts] = useState<IReviewPost[]>([]);
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

  const handlePostDelete = (postId: string) => {
    setUserPosts((prev) => prev.filter((post) => post._id !== postId));
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.postId?._id !== postId)
    );
  };

  const handleImageUpdate = async (secureUrl: string) => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:8000/api/users/profile/image",
        {
          method: "PATCH",
          body: JSON.stringify({ image: secureUrl }),
        },
        session
      );

      if (!response.ok) {
        throw new Error("Failed to update profile image");
      }

      toast.success("Cập nhật ảnh đại diện thành công");
      await update({ user: { image: secureUrl } });
    } catch (error) {
      console.error("Failed to update profile image:", error);
    }
  };

  const uploadProps: UploadProps = {
    name: "image",
    action: "http://localhost:8000/api/upload/one-image",
    showUploadList: false,
    onChange(info) {
      if (info.file.status === "done") {
        const secureUrl = info.file.response?.secure_url;
        if (secureUrl) {
          handleImageUpdate(secureUrl);
        }
      } else if (info.file.status === "error") {
        toast.error("Image upload failed");
      }
    },
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Bài viết của tôi",
      children: session ? (
        <UserPostList
          userId={session?.user?._id}
          userPosts={userPosts}
          setUserPosts={setUserPosts}
          onPostDelete={handlePostDelete}
        />
      ) : (
        "Vui lòng đăng nhập để xem các bài viết của bạn"
      ),
    },
    {
      key: "2",
      label: "Bài viết đã lưu",
      children: session ? (
        <BookmarkList
          userId={session?.user?._id}
          accessToken={session.backendTokens.accessToken}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          onPostDelete={handlePostDelete}
        />
      ) : (
        "Vui lòng đăng nhập để xem các bài viết đã lưu"
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <Image
            className="rounded-full w-24 h-24"
            height={100}
            width={100}
            src={session?.user?.image || "/profile.jpg"}
            alt="profile-pic"
          />
          <Upload {...uploadProps}>
            <button className="absolute bottom-4 right-2 bg-gray-400 px-2 py-1 rounded-full">
              <CameraOutlined />
            </button>
          </Upload>
        </div>
        <div className="-mt-4">
          <div className="text-xl font-semibold">{session?.user?.name}</div>
          <div className="text-gray-500">{session?.user?.email}</div>
        </div>
      </div>
      <div className="mt-5">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default ProfilePage;
