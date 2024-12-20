"use client";
import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/actions/getPosts";
import { useInView } from "react-intersection-observer";
import { BACKEND_URL, POSTS_PER_PAGE } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import { Spin, Button, Tooltip, Select } from "antd";
import Masonry from "react-masonry-css";

const provinces = [
  { name: "Tất cả" },
  { name: "An Giang" },
  { name: "Kon Tum" },
  { name: "Đắk Nông" },
  { name: "Sóc Trăng" },
  { name: "Bình Phước" },
  { name: "Hưng Yên" },
  { name: "Thanh Hóa" },
  { name: "Quảng Trị" },
  { name: "Tuyên Quang" },
  { name: "Quảng Ngãi" },
  { name: "Hà Nội" },
  { name: "Lào Cai" },
  { name: "Vĩnh Long" },
  { name: "Lâm Đồng" },
  { name: "Bình Định" },
  { name: "Nghệ An" },
  { name: "Kiên Giang" },
  { name: "Hà Giang" },
  { name: "Phú Yên" },
  { name: "Lạng Sơn" },
  { name: "Đà Nẵng" },
  { name: "Sơn La" },
  { name: "Tây Ninh" },
  { name: "Nam Định" },
  { name: "Lai Châu" },
  { name: "Bến Tre" },
  { name: "Khánh Hòa" },
  { name: "Bình Thuận" },
  { name: "Cao Bằng" },
  { name: "Hải Phòng" },
  { name: "Ninh Bình" },
  { name: "Yên Bái" },
  { name: "Gia Lai" },
  { name: "Hoà Bình" },
  { name: "Bà Rịa - Vũng Tàu" },
  { name: "Cà Mau" },
  { name: "Bình Dương" },
  { name: "Cần Thơ" },
  { name: "Thừa Thiên Huế" },
  { name: "Đồng Nai" },
  { name: "Tiền Giang" },
  { name: "Điện Biên" },
  { name: "Vĩnh Phúc" },
  { name: "Quảng Nam" },
  { name: "Đắk Lắk" },
  { name: "Thái Nguyên" },
  { name: "Hải Dương" },
  { name: "Bạc Liêu" },
  { name: "Trà Vinh" },
  { name: "Thái Bình" },
  { name: "Hà Tĩnh" },
  { name: "Ninh Thuận" },
  { name: "Đồng Tháp" },
  { name: "Long An" },
  { name: "Hậu Giang" },
  { name: "Quảng Ninh" },
  { name: "Phú Thọ" },
  { name: "Quảng Bình" },
  { name: "Hồ Chí Minh" },
  { name: "Hà Nam" },
  { name: "Bắc Ninh" },
  { name: "Bắc Giang" },
  { name: "Bắc Kạn" },
];

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
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
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

  useEffect(() => {
    if (selectedProvince) {
      setFilteredPosts(
        selectedProvince === "Tất cả"
          ? posts
          : posts.filter(
              (post) =>
                post.locationId &&
                post.locationId.province &&
                post.locationId.province === selectedProvince
            )
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, selectedProvince]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
  };

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

        <Select
          value={selectedProvince}
          onChange={handleProvinceChange}
          placeholder="Chọn tỉnh/thành"
          showSearch
          options={provinces.map((province) => ({
            value: province.name,
            label: province.name,
          }))}
          className="w-40"
        />
      </div>

      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-4 p-5"
        columnClassName="bg-clip-padding"
      >
        {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post._id} className="mb-4 break-inside-avoid">
              <PostCardInfinite
                post={post}
                onPostDelete={(postId: string) => {
                  setPosts((prevPosts) =>
                    prevPosts.filter((p) => p._id !== postId)
                  );
                  setFilteredPosts((prevFilteredPosts) =>
                    prevFilteredPosts.filter((p) => p._id !== postId)
                  );
                }}
              />
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
