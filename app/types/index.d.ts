interface IPost {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: { _id: string; name: string; slug: string; description: string };
  createdAt: string;
}

interface IReviewPost {
  _id: string;
  userId: string;
  title: string;
  content: string;
  images: string[];
  categoryId: string;
  address: string;
  overall: number;
  flavor: number;
  space: number;
  hygiene: number;
  price: number;
  serves: number;
}

interface ICategory {
  _id: string;
  slug: string;
  name: string;
  description: string;
  subCategories: {
    _id: string;
    slug: string;
    name: string;
    description: string;
  };
}

interface ISubCategory {
  _id: string;
  slug: string;
  name: string;
  description: string;
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
