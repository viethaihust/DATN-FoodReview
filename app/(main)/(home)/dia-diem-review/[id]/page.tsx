"use client";
import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import { List, Rate } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import MapModal from "../../components/MapModal";

export default function DiaDiemReview({ params }: { params: { id: string } }) {
  const [reviewPosts, setReviewPosts] = useState<IReviewPost[]>([]);
  const [location, setLocation] = useState<ILocation>();

  useEffect(() => {
    try {
      fetch(`${BACKEND_URL}/api/location/${params.id}`)
        .then((res) => res.json())
        .then((data) => setLocation(data as ILocation));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }, [params.id]);

  useEffect(() => {
    try {
      fetch(`${BACKEND_URL}/api/review-posts?locationId=${params.id}`)
        .then((res) => res.json())
        .then((result) => setReviewPosts(result?.data?.posts as IReviewPost[]));
    } catch (error) {
      console.error("Error fetching review posts:", error);
    }
  }, [params.id]);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">{location?.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Rate
            disabled
            value={location?.averageRating}
            style={{ color: "orange" }}
          />
          <span>{location?.averageRating}</span>
          <span className="text-gray-500">
            (
            {location?.totalRatingsCount && location.totalRatingsCount > 0
              ? `${location?.totalRatingsCount} đánh giá`
              : "Chưa có đánh giá nào"}
            )
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold">Địa chỉ: </span>
          <span>{location?.address}</span>
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
