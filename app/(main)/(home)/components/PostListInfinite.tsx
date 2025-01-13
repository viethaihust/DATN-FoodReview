"use client";
import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/actions/getPosts";
import { useInView } from "react-intersection-observer";
import { BACKEND_URL, POSTS_PER_PAGE } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import { Spin, Button, Tooltip, Select } from "antd";
import Masonry from "react-masonry-css";
import SavedLocationsMap from "./SavedLocationsMap";

const provinces = [
  { name: "Toàn quốc" },
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
  const [hasMoreData, setHasMoreData] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("Toàn quốc");
  const [scrollTrigger, isInView] = useInView();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/categories`);
        const data = await response.json();
        if (response.ok) setCategories(data.result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (hasMoreData) {
      const apiPosts = await getPosts(
        page,
        POSTS_PER_PAGE,
        selectedCategory,
        selectedProvince
      );

      if (!apiPosts?.length) {
        setHasMoreData(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...apiPosts]);
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [hasMoreData, page, selectedCategory, selectedProvince]);

  useEffect(() => {
    (async () => {
      const apiPosts = await getPosts(
        1,
        POSTS_PER_PAGE,
        selectedCategory,
        selectedProvince
      );
      setPosts(apiPosts);
      setPage(2);
      setHasMoreData(apiPosts.length === POSTS_PER_PAGE);
    })();
  }, [selectedCategory, selectedProvince]);

  useEffect(() => {
    if (isInView && hasMoreData) {
      loadMorePosts();
    }
  }, [isInView, hasMoreData, loadMorePosts]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
  };

  return (
    <>
      <div className="-mx-2 md:mx-0 md:p-5 flex flex-wrap mt-5 justify-between gap-5">
        <div className="overflow-x-auto whitespace-nowrap flex gap-2 md:gap-4">
          <Button
            onClick={() => setSelectedCategory(null)}
            className="border-2 text-black font-semibold bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 flex-shrink-0"
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Tooltip
              placement="bottom"
              key={category._id}
              title={category.description}
            >
              <Button
                onClick={() => setSelectedCategory(category._id)}
                className="border-2 text-black font-semibold bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 flex-shrink-0"
              >
                {category.name}
              </Button>
            </Tooltip>
          ))}
        </div>
        <div className="flex gap-2">
          <SavedLocationsMap />
          <Select
            value={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="Chọn tỉnh/thành"
            showSearch
            options={provinces.map((province) => ({
              value: province.name,
              label: province.name,
            }))}
            className="w-full md:w-40"
          />
        </div>
      </div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -mx-4 md:mx-0 gap-2 md:gap-4 md:px-5 mt-5 md:mt-0"
        columnClassName="bg-clip-padding"
      >
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="mb-4 break-inside-avoid">
              <PostCardInfinite
                post={post}
                onPostDelete={(postId: string) => {
                  setPosts((prevPosts) =>
                    prevPosts.filter((p) => p._id !== postId)
                  );
                }}
              />
            </div>
          ))
        ) : (
          <p className="min-h-[40rem]">Không có bài viết nào</p>
        )}
      </Masonry>
      <div className="text-center text-slate-600 mt-5">
        {hasMoreData ? (
          <div ref={scrollTrigger}>
            <Spin />
          </div>
        ) : (
          <p>Không còn bài viết nào</p>
        )}
      </div>
    </>
  );
}
