export default function PostCardInfinite({ post }: { post: IPost }) {
  return (
    <div className="p-8 mb-1 relative border-l-8 transition-all bg-white border-slate-400 hover:border-cyan-400 [counter-increment:post-index] before:content-[counter(post-index)] before:p-2 before:leading-none before:absolute before:top-0 before:right-0 before:transition-all before:bg-slate-100 hover:before:bg-cyan-100 ">
      <div>
        <span className="text-sm text-gray-600">#{post._id}</span>
      </div>
      <h2 className="mt-0 mb-4 text-xl font-extrabold first-letter:uppercase">
        {post.title}
      </h2>
      <p className="text-gray-600 first-letter:uppercase">{post.summary}</p>
    </div>
  );
}
