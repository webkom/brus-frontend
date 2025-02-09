import { useEffect, useState } from "react";
import { User } from "../utils/interfaces";
import Image from "next/image";
import UserImage from "./UserImage";
import { useQuery } from "@tanstack/react-query";
import { buyBrus } from "../utils/hooks";
import { BrusType } from "../utils/constants";

interface userButtonProps {
  user: User;
}

export const UserButton = ({ user }: userButtonProps) => {
  const [liveUser, setLiveUser] = useState<User>(user);
  const [showModal, setShowModal] = useState(false);
  const handleUserClick = () => {
    setShowModal((prev) => !prev);
  };

  const [brusType, setBrusType] = useState<BrusType>("Dahls");
  const [quantity, setQuantity] = useState<number>(0);

  const { data: updatedUser, refetch } = useQuery({
    queryKey: ["buyBrus", brusType, liveUser.brusName, quantity],
    queryFn: () => buyBrus(brusType!, liveUser.brusName, quantity!),
    enabled: false,
  });

  const handleBuyBrus = (brusType: BrusType, quantity: number) => {
    setBrusType(brusType);
    setQuantity(quantity);
    refetch();
  };

  useEffect(() => {
    if (updatedUser) {
      setLiveUser(updatedUser);
      console.log("updated user", updatedUser);
    }
  }, [updatedUser]);

  const shortenName = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0] + " " + names[1][0] + ".";
    }
    return names[0];
  };

  return (
    <>
      <button
        onClick={handleUserClick}
        className="flex flex-col items-center hover:cursor-pointer"
      >
        <UserImage user={user} />
        <span className="">{shortenName(liveUser.name)}</span>{" "}
      </button>

      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-[#ffffff34] flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="flex  flex-col bg-green-100 p-2 rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="self-end font-bold" onClick={handleUserClick}>
              x
            </button>
            <span className="flex gap-8 pb-4 pl-4 pr-4 flex-row">
              <UserImage user={liveUser} size={100} />
              <span className="flex flex-col">
                <p className="text-2xl">{user.name}</p>
                <p className="whitespace-nowrap text-xl">
                  Saldo:{" "}
                  <span
                    className={`${liveUser.saldo > 0 ? "text-green-700" : "text-red-700"}`}
                  >
                    {liveUser.saldo}
                  </span>
                </p>
              </span>
            </span>
            {}
            <button onClick={() => handleBuyBrus("Dahls", 1)}>
              Buy small brus
            </button>
          </div>
        </div>
      )}
    </>
  );
};
