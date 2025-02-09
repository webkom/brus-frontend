import React, { useEffect, useState } from "react";
import { User } from "../utils/interfaces";
import UserImage from "./UserImage";
import { useQuery } from "@tanstack/react-query";
import { BRUS_COST, BrusType } from "../utils/constants";
import { buyBrus } from "../utils/hooks";

interface BuyBrusModalProps {
  user: User;
  handleClose: () => void;
}

const BuyBrusModal = ({ user, handleClose }: BuyBrusModalProps) => {
  const [liveUser, setLiveUser] = useState<User>(user);
  const [brusType, setBrusType] = useState<BrusType>("Dahls");
  const [quantity, setQuantity] = useState<number>(1);
  const {
    data: updatedUser,
    refetch,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["buyBrus", brusType, liveUser.brusName, quantity],
    queryFn: () => buyBrus(brusType!, liveUser.brusName, quantity!),
    enabled: false,
    staleTime: 0,
  });

  const handleBuyBrus = () => {
    refetch();
  };

  useEffect(() => {
    if (updatedUser) {
      setLiveUser(updatedUser);
    }
  }, [updatedUser]);

  return (
    <div
      className="flex flex-col bg-green-100 rounded-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row justify-between bg-green-100 rounded-sm">
        <h1 className="text-2xl">{liveUser.name} brus</h1>
        <button
          className="relative border-2 rounded-full font-bold w-8 h-8 bottom-4 left-4 bg-amber-100"
          onClick={handleClose}
        >
          x
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <div className="">
          <UserImage user={liveUser} size={100} />
          <span className="flex flex-col">
            <p className="whitespace-nowrap">
              Saldo:{" "}
              <span
                className={`${liveUser.saldo > 0 ? "text-green-700" : "text-red-700"}`}
              >
                {liveUser.saldo}
              </span>
            </p>
            {isSuccess && <p>Brus bought!</p>}
          </span>
        </div>
        <div className="justify-between gap-4">
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
          <p>Buying brus...</p>
        ) : (
          <button
            onClick={() => handleBuyBrus()}
            className="bg-green-500 border-2 border-green-700"
          >
            Buy brus
          </button>
        )}
      </div>
    </div>
  );
};

export default BuyBrusModal;
