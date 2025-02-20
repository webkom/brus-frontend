import { useEffect, useState } from "react";
import { User } from "../utils/interfaces";
import UserImage from "./UserImage";
import BuyBrusModal from "./BuyBrusModal";

interface userButtonProps {
  user: User;
}

export const UserButton = ({ user }: userButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClick = () => {
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
        onClick={handleModalClick}
        className="flex flex-col items-center hover:cursor-pointer"
      >
        <UserImage user={user} />
        <span className="">{shortenName(user.name)}</span>{" "}
      </button>

      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-[#ffffff34] flex items-center justify-center"
          onClick={handleModalClick}
        >
          <BuyBrusModal user={user} handleClose={handleModalClick} />
        </div>
      )}
    </>
  );
};
