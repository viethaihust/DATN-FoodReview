"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { List, Avatar, Typography, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

type User = {
  _id: string;
  name: string;
  type: string;
};

type Post = {
  _id: string;
  title: string;
  content: string;
};

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/review-posts/search?query=${encodeURIComponent(
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
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  return (
    <div className="py-4">
      <Typography.Title level={4}>
        Tìm kiếm kết quả cho &quot;{query}&quot;
      </Typography.Title>
      {loading ? (
        <Spin tip="Đang tải kết quả..." />
      ) : (
        <>
          <List
            header={<div>Người dùng</div>}
            bordered
            dataSource={users}
            renderItem={(user: User) => (
              <List.Item key={user._id}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={user.name}
                  style={{ alignItems: "center" }}
                />
              </List.Item>
            )}
            locale={{ emptyText: "Không tìm thấy người dùng nào." }}
          />
          <List
            header={<div>Bài viết</div>}
            bordered
            dataSource={posts}
            renderItem={(post: Post) => (
              <List.Item key={post._id}>
                <List.Item.Meta title={post.title} description={post.content} />
              </List.Item>
            )}
            locale={{ emptyText: "Không tìm thấy bài viết nào." }}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
