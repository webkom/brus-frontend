import { MEMBERS_URL } from "@/app/utils/constants";
import { Member, User } from "@/app/utils/interfaces";
import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";

export async function GET() {
  const response = await fetch(MEMBERS_URL, {
    headers: {
      Authorization: `Basic ${process.env.MEMBERS_AUTH_KEY}`,
      Accept: "application/json",
    },
  });

  let users: User[] = [];
  try {
    const data = await response.json();
    users = data
      .filter((m: Member) => m.active)
      .map((member: Member) => ({
        name: member.name,
        brusName: member.brus,
        github: member.github,
        saldo: 0,
        avatar: member.avatar,
      }));
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
  if (!(await addUsersToCollection(users))) {
    return NextResponse.json(
      { error: "Failed to add users to database" },
      { status: 500 }
    );
  }

  return NextResponse.json({ activeUsers: users }, { status: 200 });
}

const addUsersToCollection = async (users: User[]) => {
  try {
    const userCollection = await getUserCollection();
    const userBrusNames = users.map((user) => user.brusName);
    const existingUserNames = new Set(
      (
        await userCollection
          .find({ brusName: { $in: userBrusNames } })
          .project({ brusName: 1 })
          .toArray()
      ).map((user) => user.brusName)
    );
    const newUsers = users.filter((u) => !existingUserNames.has(u.brusName));
    newUsers.length > 0 && (await userCollection.insertMany(newUsers));
    return true;
  } catch (error) {
    console.error("Failed to add users to database:", error);
    return false;
  }
};
