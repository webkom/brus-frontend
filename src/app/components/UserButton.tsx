import { useState } from "react";
import { User } from "../utils/interfaces";
import Image from "next/image";
import UserImage from "./UserImage";

interface userButtonProps {
  user: User;
}

export const UserButton = ({ user }: userButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const handleUserClick = () => {
    setShowModal((prev) => !prev);
  };

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
        <span className="">{shortenName(user.name)}</span>{" "}
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
              <UserImage user={user} size={100} />
              <span className="flex flex-col">
                <p className="text-2xl">{user.name}</p>
                <p className="whitespace-nowrap text-xl">
                  Saldo:{" "}
                  <span
                    className={`${user.saldo > 0 ? "text-green-700" : "text-red-700"}`}
                  >
                    {user.saldo}
                  </span>
                </p>
              </span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};
