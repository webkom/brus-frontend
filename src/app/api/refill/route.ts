import { getUserCollection } from "../mongodb";
import { BRUS_COST } from "@/app/utils/constants";
import { BuyRefillBrusRequest } from "@/app/utils/interfaces";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const userCollection = await getUserCollection();
    const data = (await req.json()) as BuyRefillBrusRequest;
    const amount = data.brusAmount;
    const username = data.userBrusName;
    userCollection.updateOne(
      { brusName: username },
      { $inc: { saldo: amount * BRUS_COST[data.brusType] } }
    );
    const updatedUser = await userCollection.findOne({ brusName: username });
    if (!updatedUser) {
      return NextResponse.json({ error: "No user found" }, { status: 500 });
    }
    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
