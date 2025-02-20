import { NextResponse } from "next/server";
import { getUserCollection } from "../mongodb";
import { BRUS_COST } from "@/app/utils/constants";
import { BuyRefillBrusRequest } from "@/app/utils/interfaces";

export async function POST(req: Request) {
  const userCollection = await getUserCollection();
  try {
    const data = (await req.json()) as BuyRefillBrusRequest;
    const amount = data.brusAmount;
    const username = data.userBrusName;
    const brusType = data.brusType;
    userCollection.updateOne(
      { brusName: username },
      { $inc: { saldo: -amount * BRUS_COST[brusType] } }
    );

    const updatedUser = await userCollection.findOne({ brusName: username });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Buying brus unsuccessful" },
      { status: 500 }
    );
  }
}
