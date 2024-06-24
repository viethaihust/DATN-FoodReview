import User from "../../models/User";
import connectMongoDB from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, name, password } = await req.json();

  await connectMongoDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email này đã được sử dụng" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({
    email,
    name,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return NextResponse.json(
      { success: "Tạo tài khoản thành công" },
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
