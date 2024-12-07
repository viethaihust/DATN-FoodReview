import { BACKEND_URL } from "@/lib/constants";
import { formatDate } from "@/utils/formatDate";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

export default async function BaiViet({ params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const post = await fetch(`${BACKEND_URL}/api/posts/${params.id}`, {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((result) => result.data as IPost);

  const postContent = post.content;

  return (
    <div>
      <div>
        <div className="text-4xl font-semibold">{post.title}</div>
        <div className="mt-5 flex opacity-80 gap-6 text-gray-800">
          <span>
            <UserOutlined className="mr-2" />
            by Review ẩm thực
          </span>
          <span>
            <ClockCircleOutlined className="mr-2" />
            {formatDate(post.createdAt)}
          </span>
          <span>{post.category?.name}</span>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: postContent,
          }}
          className="mt-6"
        />
      </div>
      <div>
        <h1 className="text-2xl mb-4">Nested Comments Section</h1>
      </div>
    </div>
  );
}
