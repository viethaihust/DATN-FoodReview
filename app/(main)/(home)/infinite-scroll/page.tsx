import { getPosts } from "@/actions/getPosts";
import { POSTS_PER_PAGE } from "@/lib/constants";
import PostListInfinite from "../components/PostListInfinite";

export default async function InfiniteScroll() {
  const initialPosts = await getPosts(1, POSTS_PER_PAGE);

  return (
    <>
      <div className="max-w-3xl mx-auto p-5">
        <h1 className="text-center text-2xl mb-2">Loading posts on scroll</h1>
        <PostListInfinite initialPosts={initialPosts} />
      </div>
    </>
  );
}
