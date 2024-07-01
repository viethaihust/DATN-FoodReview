import Category from "@/models/Category";
import Post from "@/models/Post";
import connectMongoDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, summary, content, image, category } = await req.json();

  await connectMongoDB();

  const newPost = new Post({
    title,
    summary,
    content,
    image,
    category,
  });

  try {
    await newPost.save();
    return NextResponse.json(
      { success: "Tạo bài post thành công" },
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const categoryName = searchParams.get("categoryName");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");
  const random = searchParams.get("random");

  try {
    if (id) {
      const post = await Post.findById(id).populate("category", "name").exec();
      if (!post) {
        return new NextResponse("Post not found", { status: 404 });
      }
      return NextResponse.json(post, { status: 200 });
    }

    let query: any = {};
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName }).exec();
      if (!category) {
        return new NextResponse("Category not found", { status: 404 });
      }
      query = { category: category._id };
    }

    if (random && random.toLowerCase() === "true") {
      const randomPosts = await Post.aggregate([
        { $match: query },
        { $sample: { size: 4 } },
      ]);

      if (!randomPosts || randomPosts.length === 0) {
        return new NextResponse("No random posts found", { status: 404 });
      }

      return NextResponse.json({ randomPosts }, { status: 200 });
    }

    const totalPosts = await Post.countDocuments(query).exec();
    const posts = await Post.find(query)
      .populate("category", "name")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    if (!posts || posts.length === 0) {
      return new NextResponse("No posts found", { status: 404 });
    }

    return NextResponse.json({ posts, totalPosts }, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
