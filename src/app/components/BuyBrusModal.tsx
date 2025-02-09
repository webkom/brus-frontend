import React, { useEffect, useState } from "react";
import { User } from "../utils/interfaces";
import UserImage from "./UserImage";
import BuyOrRefill from "./BuyOrRefill";

interface BuyBrusModalProps {
  user: User;
  handleClose: () => void;
}

const BuyBrusModal = ({ user, handleClose }: BuyBrusModalProps) => {
  const [liveUser, setLiveUser] = useState(user);
  useEffect(() => {
    setLiveUser(user);
  }, [user]);
  return (
    <div
      className="flex flex-col bg-green-100 rounded-sm p-4 pt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row justify-between bg-green-100 rounded-sm">
        <h1 className="text-2xl">{user.name} brus</h1>
        <button
          className="relative border-2 rounded-full font-bold w-8 h-8 bottom-4 left-4 bg-amber-100"
          onClick={handleClose}
        >
          x
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <div className="">
          <UserImage user={user} size={100} />
          <span className="flex flex-col">
            <p className="whitespace-nowrap">
              Saldo:{" "}
              <span
                className={`${liveUser.saldo > 0 ? "text-green-700" : "text-red-700"}`}
              >
                {liveUser.saldo}
              </span>
            </p>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <BuyOrRefill
            liveUser={user}
            setLiveUser={setLiveUser}
            buyOrRefill="buyBrus"
          />
          <BuyOrRefill
            liveUser={user}
            setLiveUser={setLiveUser}
            buyOrRefill="refillBrus"
          />
        </div>
      </div>
    </div>
  );
};

export default BuyBrusModal;
