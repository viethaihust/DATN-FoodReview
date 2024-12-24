"use client";
import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import { List, Rate } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MapModal from "../../components/MapModal";
import Link from "next/link";
import FollowButton from "../../components/FollowButton";

export default function NguoiDung({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingsCount, setFollowingsCount] = useState<number>(0);
  const [reviewPosts, setReviewPosts] = useState<IReviewPost[]>([]);

  useEffect(() => {
    try {
      fetch(`${BACKEND_URL}/api/users/${params.id}`)
        .then((res) => res.json())
        .then((data) => setUser(data as IUser));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [params.id]);

  useEffect(() => {
    try {
      fetch(`${BACKEND_URL}/api/follows/followers-count/${params.id}`)
        .then((res) => res.json())
        .then((data) => setFollowersCount(data));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [params.id]);

  useEffect(() => {
    try {
      fetch(`${BACKEND_URL}/api/follows/followings-count/${params.id}`)
        .then((res) => res.json())
        .then((data) => setFollowingsCount(data));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [params.id]);

  useEffect(() => {
    try {
      fetch(`${BACKEND_URL}/api/review-posts?userId=${params.id}`)
        .then((res) => res.json())
        .then((result) => setReviewPosts(result.data.posts as IReviewPost[]));
    } catch (error) {
      console.error("Error fetching review posts:", error);
    }
  }, [params.id]);

  return (
    <div>
      <div className="flex items-center gap-6 p-6 rounded-lg border shadow-md">
        <Image
          className="rounded-full"
          height={100}
          width={100}
          src={user?.image || "/profile.jpg"}
          alt="profile-pic"
        />
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <FollowButton userId={params.id} />
          </div>
          <div className="flex gap-6 mt-2 text-gray-600">
            <div>
              <strong>{reviewPosts.length} </strong>Bài viết
            </div>
            <div>
              <strong>{followersCount}</strong> Người theo dõi
            </div>
            <div>
              <strong>{followersCount}</strong> Đang theo dõi
            </div>
          </div>
        </div>
      </div>
      <List
        header={<div>Bài viết</div>}
        bordered
        dataSource={reviewPosts}
        renderItem={(post: IReviewPost) => (
          <List.Item key={post._id}>
            <div className="w-full">
              <div className="flex items-center gap-6">
                <Image
                  className="cursor-pointer hover:shadow-sm hover:shadow-slate-400 rounded-full"
                  height={60}
                  width={60}
                  src={post.userId.image || "/profile.jpg"}
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
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <Rate
                    allowHalf
                    disabled
                    value={post.ratings.overall}
                    style={{ color: "orange" }}
                  />
                  <span className="ml-5">
                    <strong className="text-lg">{post.ratings.overall}</strong>
                    /5 điểm
                  </span>
                </div>
                <div className="flex flex-row gap-2 opacity-80">
                  <div>Hương vị: {post.ratings.flavor}</div>
                  <div>Không gian: {post.ratings.space}</div>
                  <div>Vệ sinh: {post.ratings.hygiene}</div>
                  <div>Giá cả: {post.ratings.price}</div>
                  <div>Phục vụ: {post.ratings.serves}</div>
                </div>
              </div>
              <Link
                href={`/bai-viet-review/${post._id}`}
                className="font-semibold text-xl mt-4 hover:text-orange-600"
              >
                {post.title}
              </Link>
              <div>{post.content}</div>
              <div className="flex mt-2 gap-2 flex-wrap">
                {post.files.map((file, index) => (
                  <Image
                    key={index}
                    src={file}
                    alt={`${post.title} - Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          </List.Item>
        )}
        locale={{ emptyText: "Không tìm thấy bài viết nào." }}
        className="mt-10"
      />
    </div>
  );
}
