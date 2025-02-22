"use client";
import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import { List, Rate } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { removeHtmlTags } from "@/utils/removeHtmlTags";
import MapModalButton from "../../components/MapModalButton";

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
          <span className="flex items-center gap-2">
            <span>{location?.address}</span>
            <MapModalButton
              destination={location?.latLong || { lat: 0, lng: 0 }}
            />
          </span>
        </div>
        {location?.description && (
          <div>
            <span className="font-semibold">Mô tả địa điểm: </span>
            <span>{location?.description}</span>
          </div>
        )}
      </div>
      <List
        header={<div>Bài viết</div>}
        bordered
        dataSource={reviewPosts}
        renderItem={(post: IReviewPost) => (
          <List.Item key={post._id}>
            <div className="w-full">
              <div className="flex items-center gap-6">
                <Link href={`/nguoi-dung/${post.userId._id}`}>
                  <Image
                    className="cursor-pointer hover:shadow-sm hover:shadow-slate-400 rounded-full object-cover min-w-12 aspect-square"
                    height={60}
                    width={60}
                    src={post.userId.image || "/profile.jpg"}
                    alt="profile-pic"
                  />
                </Link>
                <div>
                  <div className="font-bold">{post.userId.name}</div>
                  <div>
                    <span>{formatDate(post.createdAt)} tại&nbsp;</span>
                    <span className="text-orange-600">
                      {post.locationId.name} - {post.locationId.address}
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:flex justify-between items-center mt-2">
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
              <div>{removeHtmlTags(post.content)}</div>
              <div className="flex mt-2 gap-2 flex-wrap">
                {post.files.map((file, index) => (
                  <Image
                    key={index}
                    src={
                      file?.includes("video")
                        ? file.replace(".mp4", ".jpg")
                        : file
                    }
                    alt={`${post.title} - File ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
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
