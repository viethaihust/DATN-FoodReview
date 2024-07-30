import { BACKEND_URL } from "@/lib/constants";
import ClientCommentSection from "./ClientCommentSection";

export default async function ServerCommentSection({
  postId,
}: {
  postId: string;
}) {
  const comments = await fetch(`${BACKEND_URL}/comments?postId=${postId}`, {
    cache: "no-store",
  }).then((res) => res.json());

  return (
    <div>
      <ClientCommentSection comments={comments} postId={postId} />
    </div>
  );
}
