"use client";
import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/actions/getPosts";
import { useInView } from "react-intersection-observer";
import { POSTS_PER_PAGE } from "@/lib/constants";
import PostCardInfinite from "./PostCardInfinite";
import { Spin, Row, Col } from "antd";

export default function PostListInfinite({
  initialPosts,
}: {
  initialPosts: IReviewPost[];
}) {
  const [page, setPage] = useState(2);
  const [posts, setPosts] = useState<IReviewPost[]>(initialPosts);
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
      <div></div>
      <div className="pt-5 md:p-5">
        <Row gutter={[16, 16]}>
          {Array.isArray(posts) ? (
            posts.map((post) => (
              <Col key={post._id} xs={24} sm={12} md={8} lg={6}>
                <PostCardInfinite post={post} />
              </Col>
            ))
          ) : (
            <p>Không có bài viết nào</p>
          )}
        </Row>
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
