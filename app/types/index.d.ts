interface IPost {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: { _id: string; name: string; desc: string };
  createdAt: string;
}

interface ICategory {
  _id: string;
  name: string;
  desc: string;
}

interface IComment {
  _id: string;
  user: User;
  content: string;
  likes: number;
  likedBy: User[];
  replies: IComment[];
  createdAt: string;
}

interface IUser {
  _id: string;
  name: string;
}

interface ICommentComponentProps {
  comment: IComment;
  onLike: (id: string) => void;
  onReply: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}
