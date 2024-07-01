import Category from "@/models/Category";
import connectMongoDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  try {
    const categories = await Category.find({}, "name");
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
