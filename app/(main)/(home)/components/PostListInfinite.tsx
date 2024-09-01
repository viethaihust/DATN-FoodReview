"use client";
import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/actions/getPosts";
import { useInView } from "react-intersection-observer";
import { POSTS_PER_PAGE } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";

export default function PostListInfinite({
  initialPosts,
}: {
  initialPosts: IPost[];
}) {
  const [page, setPage] = useState(2);
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [scrollTrigger, isInView] = useInView();

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
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4">
        {Array.isArray(posts) ? (
          posts.map((post) => <PostCardInfinite key={post._id} post={post} />)
        ) : (
          <p>No posts available</p>
        )}
      </div>

      <div className="text-center text-slate-600 mt-5">
        {(hasMoreData && <div ref={scrollTrigger}>Loading...</div>) || (
          <p className="text-slate-600">No more posts to load</p>
        )}
      </div>
    </>
  );
}
