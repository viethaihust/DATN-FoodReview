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
