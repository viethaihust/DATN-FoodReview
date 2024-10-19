"use client";
import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/actions/getPosts";
import { useInView } from "react-intersection-observer";
import { POSTS_PER_PAGE } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import { Spin } from "antd";
import { useSession } from "next-auth/react";

export default function PostListInfinite({
  initialPosts,
}: {
  initialPosts: IPost[];
}) {
  const [page, setPage] = useState(2);
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [scrollTrigger, isInView] = useInView();
  const { data: session } = useSession();

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

  return (
    <>
      <div className="pt-5 md:p-5 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {Array.isArray(posts) ? (
          posts.map((post) => (
            <PostCardInfinite key={post._id} post={post} userId={session?.user._id} />
          ))
        ) : (
          <p>Không có bài viết nào</p>
        )}
      </div>

      <div className="text-center text-slate-600 mt-5">
        {(hasMoreData && (
          <div ref={scrollTrigger}>
            <Spin />
          </div>
        )) || <p className="text-slate-600">Không còn bài viết nào</p>}
      </div>
    </>
  );
}
