import { User } from "../utils/interfaces";
import Image from "next/image";

interface userButtonProps {
  user: User;
}

export const UserButton = ({ user }: userButtonProps) => {
  return (
    <>
      <button className="flex flex-col items-center hover:cursor-pointer">
        <Image src={user.avatar} alt={user.name} width={100} height={100} />
        <span>{user.name}</span>
      </button>
    </>
  );
};
