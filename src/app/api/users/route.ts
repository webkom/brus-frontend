import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";
import { User } from "@/app/utils/interfaces";

export async function GET(req: Request) {
  const user_collection = await getUserCollection();
  const users: User[] = (await user_collection.find({}).toArray()) as User[];

  return new NextResponse(JSON.stringify(users));
}
