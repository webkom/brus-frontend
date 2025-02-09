import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";
import { User } from "@/app/utils/interfaces";

export async function GET() {
  try {
    const user_collection = await getUserCollection();
    const users: User[] = (await user_collection.find({}).toArray()) as User[];
    return NextResponse.json({ users: users }, { status: 200 });
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
  }

  return NextResponse.json({ users: [] }, { status: 200 });
}
