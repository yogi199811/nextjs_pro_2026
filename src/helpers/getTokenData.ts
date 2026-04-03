import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getTokenData = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) return;

    const decode: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    return decode.id;
  } catch (error: any) {
    throw new error(error.message);
  }
};
