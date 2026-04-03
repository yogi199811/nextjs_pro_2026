import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { token } = reqBody;
    console.log(token);

  const user =  await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if(!user){
        return NextResponse.json({error:"Invalid Token"},{status:400})
    }

    console.log(user)

    user.verifyToken=undefined
    user.verifyTokenExpiry = undefined
    user.isVerified = true
    await user.save()


    return NextResponse.json({ message : "Email verify Successfully",success:true }, { status: 200 });


  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
