import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import sendEmail from "@/helpers/mailer";
import { error } from "console";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist with this email" },
        { status: 400 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
    }

    const token = await jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.TOKEN_SECRET!,
      { expiresIn: "10d" },
    );

   const response =  NextResponse.json(
      { message: "Login Successfull", success: true,user },
      { status: 200 },
    );

    response.cookies.set("token",token,{
        httpOnly:true
    })

    console.log(response)

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
