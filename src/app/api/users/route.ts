import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";
import { User } from "@/app/utils/interfaces";

export async function GET() {
  try {
    const userCollection = await getUserCollection();
    const users: User[] = (await userCollection.find({}).toArray()) as User[];
    return NextResponse.json({ users: users }, { status: 200 });
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
