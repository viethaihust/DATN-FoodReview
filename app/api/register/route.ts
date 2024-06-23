import User from "../../models/User";
import connectMongoDB from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, name, password } = await req.json();

  await connectMongoDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({
    email,
    name,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse("User Created", { status: 201 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
