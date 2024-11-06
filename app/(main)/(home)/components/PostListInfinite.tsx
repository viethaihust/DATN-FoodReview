"use client";
import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/actions/getPosts";
import { useInView } from "react-intersection-observer";
import { BACKEND_URL, POSTS_PER_PAGE } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import { Spin, Button, Tooltip } from "antd";
import Masonry from "react-masonry-css";
export default function PostListInfinite({
  initialPosts,
}: {
  initialPosts: IReviewPost[];
}) {
  const [page, setPage] = useState(2);
  const [posts, setPosts] = useState<IReviewPost[]>(initialPosts);
  const [filteredPosts, setFilteredPosts] =
    useState<IReviewPost[]>(initialPosts);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scrollTrigger, isInView] = useInView();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categories`);
      const data = await response.json();
      if (response.ok) setCategories(data.result);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const loadMorePosts = useCallback(async () => {
    if (hasMoreData) {
      const apiPosts = await getPosts(page, POSTS_PER_PAGE);

      if (!apiPosts?.length) {
        setHasMoreData(false);
      }

      setPosts((prevPosts) => [...prevPosts, ...apiPosts]);
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMoreData, page]);

  useEffect(() => {
    if (isInView && hasMoreData) {
      loadMorePosts();
    }
  }, [isInView, hasMoreData, loadMorePosts]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPosts(
        posts.filter((post) => post.categoryId._id === selectedCategory)
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, selectedCategory]);

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <>
      <div className="flex gap-4 px-5 mt-10">
        <Tooltip placement="bottom">
          <Button
            onClick={() => setSelectedCategory(null)}
            className="border-2 text-black font-semibold bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300"
          >
            Tất cả
          </Button>
        </Tooltip>

        {categories.map((category) => (
          <Tooltip
            placement="bottom"
            key={category._id}
            title={category.description}
          >
            <Button
              onClick={() => setSelectedCategory(category._id)}
              className="border-2 text-black font-semibold bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300"
            >
              {category.name}
            </Button>
          </Tooltip>
        ))}
      </div>

      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-4 p-5"
        columnClassName="bg-clip-padding"
      >
        {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post._id} className="mb-4 break-inside-avoid">
              <PostCardInfinite post={post} />
            </div>
          ))
        ) : (
          <p>Không có bài viết nào</p>
        )}
      </Masonry>

      <div className="text-center text-slate-600 mt-5">
        {hasMoreData ? (
          <div ref={scrollTrigger}>
            <Spin />
          </div>
        ) : filteredPosts.length > 0 ? (
          <p className="text-slate-600">Không còn bài viết nào</p>
        ) : null}
      </div>
    </>
  );
}
