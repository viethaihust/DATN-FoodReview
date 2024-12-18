"use client";
import { CameraOutlined } from "@ant-design/icons";
import { Tabs, TabsProps } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import BookmarkList from "../components/BookmarkList";
import UserPostList from "../components/UserPostList";
import { useState } from "react";

const ProfilePage = () => {
  const { data: session } = useSession();

  const [userPosts, setUserPosts] = useState<IReviewPost[]>([]);
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

  const handlePostDelete = (postId: string) => {
    setUserPosts((prev) => prev.filter((post) => post._id !== postId));
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.postId?._id !== postId)
    );
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
            className="rounded-full"
            height={100}
            width={100}
            src={session?.user?.image || "/profile.jpg"}
            alt="profile-pic"
          />
          <button className="absolute bottom-0 right-0 bg-gray-400 px-2 py-1 rounded-full">
            <CameraOutlined />
          </button>
        </div>
        <div>
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
