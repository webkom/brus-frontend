import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";

const BRUS_COST = 31;

export async function POST(req: Request) {
  const user_collection = await getUserCollection();

  const data = await req.json();
  const amount = data.amount;
  const username = data.username;
  user_collection.updateOne(
    { name: username },
    { $inc: { saldo: -amount * BRUS_COST } },
  );

  return NextResponse.json({}, { status: 200 });
}
