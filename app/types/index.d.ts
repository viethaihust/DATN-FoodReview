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

interface IPostComment {
  _id: string;
  user: string;
  content: string;
  likes: number;
  replies: IPostComment[];
}
