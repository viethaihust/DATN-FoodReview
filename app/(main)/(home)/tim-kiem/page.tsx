"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { List, Typography, Rate } from "antd";
import Image from "next/image";
import MapModal from "../components/MapModal";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/constants";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [users, setUsers] = useState<IUser[]>([]);
  const [posts, setPosts] = useState<IReviewPost[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/review-posts/search?query=${encodeURIComponent(
            query
          )}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setUsers(data.users || []);
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  console.log(posts);

  return (
    <div className="py-4">
      <Typography.Title level={4}>
        Tìm kiếm kết quả cho &quot;{query}&quot;
      </Typography.Title>
      <>
        <List
          header={<div>Người dùng</div>}
          bordered
          dataSource={users}
          renderItem={(user: IUser) => (
            <Link href={`/nguoi-dung/${user._id}`}>
              <List.Item key={user._id}>
                <List.Item.Meta
                  avatar={
                    <Image
                      src={user.image || "/profile.jpg"}
                      alt="user-image"
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%" }}
                    />
                  }
                  title={user.name}
                  style={{ alignItems: "center" }}
                />
              </List.Item>
            </Link>
          )}
          locale={{ emptyText: "Không tìm thấy người dùng nào." }}
        />
        <List
          header={<div>Bài viết</div>}
          bordered
          dataSource={posts}
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
                      <strong className="text-lg">
                        {post.ratings.overall}
                      </strong>
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
                  href={`dia-diem-review/${post._id}`}
                  className="font-semibold text-xl mt-4 hover:text-orange-600"
                >
                  {post.title}
                </Link>
                <div>{post.content}</div>
                <div className="flex mt-2 gap-2 flex-wrap">
                  {post.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
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
      </>
    </div>
  );
};

export default SearchResultsPage;
