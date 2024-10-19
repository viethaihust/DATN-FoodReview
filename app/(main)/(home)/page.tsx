import { getPosts } from "@/actions/getPosts";
import HomeBanner from "./components/HomeBanner";
import HomeCategory from "./components/HomeCategory";
import PostListInfinite from "./components/PostListInfinite";
import { POSTS_PER_PAGE } from "@/lib/constants";

export default async function HomePage() {
  const initialPosts = await getPosts(1, POSTS_PER_PAGE);

  return (
    <div>
      <main>
        <HomeBanner />
        <HomeCategory />
        <PostListInfinite initialPosts={initialPosts} />
      </main>
    </div>
  );
}
