interface IPost {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: { _id: string; name: string };
  createdAt: string;
}

interface ICategory {
  _id: string;
  name: string;
}
