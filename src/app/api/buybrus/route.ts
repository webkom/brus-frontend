import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";
import { BRUS_COST } from "@/app/utils/constants";
import { buyBrusRequest } from "@/app/utils/interfaces";

export async function POST(req: Request) {
  const user_collection = await getUserCollection();

  const data = (await req.json()) as buyBrusRequest;
  const amount = data.brusAmount;
  const username = data.github;
  user_collection.updateOne(
    { github: username },
    { $inc: { saldo: -amount * BRUS_COST } },
  );

  return NextResponse.json({}, { status: 200 });
}
