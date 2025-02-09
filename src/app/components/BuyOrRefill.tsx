import React, { useEffect, useState } from "react";
import { BRUS_COST, BrusType } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { buyBrus, refillBrus } from "../utils/hooks";
import { BuyRefillBrusRequest, User } from "../utils/interfaces";

interface BuyOrRefillProps {
  liveUser: User;
  setLiveUser: (user: User) => void;
  buyOrRefill: "buyBrus" | "refillBrus";
}

const BuyOrRefill = ({
  liveUser,
  setLiveUser,
  buyOrRefill,
}: BuyOrRefillProps) => {
  const [brusType, setBrusType] = useState<BrusType>("Dahls");
  const [quantity, setQuantity] = useState<number>(1);
  const {
    data: updatedUser,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [buyOrRefill, { brusAmount: quantity, brusType: brusType }],
    queryFn: () =>
      buyOrRefill === "buyBrus"
        ? buyBrus({
            brusAmount: quantity,
            brusType: brusType,
            userBrusName: liveUser.brusName,
          })
        : refillBrus({
            brusAmount: quantity,
            brusType: brusType,
            userBrusName: liveUser.brusName,
          }),
    enabled: false,
  });

  const handleBuyBrus = () => {
    refetch();
  };

  useEffect(() => {
    if (updatedUser) {
      setLiveUser(updatedUser);
    }
  }, [updatedUser]);

  const fetchingText =
    buyOrRefill === "buyBrus" ? "Buying brus" : "Refilling brus";
  const buttonText = buyOrRefill === "buyBrus" ? "Buy brus" : "Refill";

  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <select
          value={brusType}
          onChange={(e) => setBrusType(e.target.value as BrusType)}
          className="border-2 border-green-700 p-1 w-auto rounded-sm"
        >
          {Object.keys(BRUS_COST).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <input
          className="border-2 border-green-700 text-center rounded-sm"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
        />
      </div>
      {isFetching ? (
        <p>{fetchingText}</p>
      ) : (
        <button
          onClick={handleBuyBrus}
          className="bg-green-500 border-2 border-green-700"
        >
          {buttonText}
        </button>
      )}
    </>
  );
};

export default BuyOrRefill;
