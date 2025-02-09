import { User } from "@/app/utils/interfaces";
import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";

export async function POST(req: Request) {
  const body = await req.json();
  const users = body.members as User[];

  const user_collection = await getUserCollection();
  const userBrusNames = users.map((user) => user.brusName);
  const existingUserNames = new Set(
    (
      await user_collection
        .find({ brusName: { $in: userBrusNames } })
        .project({ brusName: 1 })
        .toArray()
    ).map((user) => user.brusName),
  );
  const newUsers = users.filter(
    (user, index, self) =>
      !existingUserNames.has(user.brusName) &&
      index === self.findIndex((u) => u.brusName === user.brusName),
  );

  console.log("Adding new users", newUsers);
  if (newUsers.length > 0) {
    await user_collection.insertMany(newUsers);
  }
  return NextResponse.json(newUsers, { status: 200 });
}
