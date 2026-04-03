import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import sendEmail from "@/helpers/mailer";
import { error } from "console";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getTokenData } from "@/helpers/getTokenData";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const userid = getTokenData(request);
    if (!userid) return;

    const user = await User.findById(userid).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          error: "user does not exits",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "user find successfully",
        success: true,
        user,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
