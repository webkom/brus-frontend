import { MEMBERS_URL } from "@/app/utils/constants";
import { Member } from "@/app/utils/interfaces";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const response = await fetch(MEMBERS_URL, {
    headers: {
      Authorization: `Basic ${process.env.MEMBERS_AUTH_KEY}`,
      Accept: "application/json",
    },
  });

  const members = (await response.json())
    .filter((m: Member) => m.active)
    .map((member: Member) => ({
      name: member.name,
      brusName: member.brus,
      github: member.github,
      saldo: 0,
      avatar: member.avatar,
    }));
  return NextResponse.json({ members }, { status: 200 });
}
