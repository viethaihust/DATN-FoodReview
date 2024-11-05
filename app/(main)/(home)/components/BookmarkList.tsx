import { useEffect, useState } from "react";
import { Card, Rate } from "antd";
import Image from "next/image";
import { BACKEND_URL } from "@/lib/constants";
import Link from "next/link";

const BookmarkList = ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/bookmark?userId=${userId}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data);
        } else {
          console.error("Lỗi khi lấy các bài viết đã lưu.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy các bài viết đã lưu:", error);
      }
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {bookmarks.map(({ _id, postId }) => (
        <Link href={`/dia-diem-review/${_id}`} key={_id}>
          <Card
            key={_id}
            hoverable
            cover={
              <Image
                src={postId.images[0] || "/placeholder.png"}
                alt="Post image"
                width={400}
                height={250}
                className="object-cover rounded-t-md"
              />
            }
            className="rounded-lg overflow-hidden shadow-md"
          >
            <h2 className="text-lg font-semibold">{postId.title}</h2>
            <p className="text-gray-600 mb-2">
              {postId.content.slice(0, 100)}...
            </p>
            <div className="flex items-center gap-2">
              <Rate
                disabled
                defaultValue={postId.ratings.overall}
                style={{ color: "orange" }}
              />
              <span className="text-sm text-gray-500">
                {postId.ratings.overall} / 5
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{postId.address}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default BookmarkList;
