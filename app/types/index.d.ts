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
  userId: { _id: string; name: string; image?: string };
  title: string;
  content: string;
  files: string[];
  categoryId: { _id: string; name: string; description: string };
  locationId: {
    _id: string;
    name: string;
    address: string;
    province: string;
    latLong: { lat: number; lng: number };
  };
  likesCount: number;
  ratings: {
    overall: number;
    flavor: number;
    space: number;
    hygiene: number;
    price: number;
    serves: number;
  };
  createdAt: string;
}

interface ICategory {
  _id: string;
  name: string;
  description: string;
}

interface ISubCategory {
  _id: string;
  slug: string;
  name: string;
  description: string;
}

interface IComment {
  _id: string;
  userId: User;
  content: string;
  likes: number;
  replies: number;
  postId: Post;
  likedBy: User[];
  createdAt: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  banned: boolean;
}

interface ICommentComponentProps {
  comment: IComment;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}

interface IBookmark {
  _id: string;
  postId: {
    _id: string;
    userId: { _id: string; name: string };
    title: string;
    content: string;
    files: string[];
    categoryId: { _id: string; name: string; description: string };
    locationId: {
      _id: string;
      name: string;
      address: string;
      province: string;
      latLong: { lat: number; lng: number };
    };
    likesCount: number;
    ratings: {
      overall: number;
      flavor: number;
      space: number;
      hygiene: number;
      price: number;
      serves: number;
    };
    createdAt: string;
  };
}

interface ILocation {
  _id: string;
  name: string;
  address: string;
  province: string;
  latLong: {
    lat: number;
    lng: number;
  };
}

interface INotification {
  _id: string;
  reciever: User;
  sender: User;
  postId: ReviewPost;
  message: string;
  read: boolean;
  createdAt: string;
}
