import { User } from "../utils/interfaces";

interface userButtonProps {
  user: User;
}

export const UserButton = ({ user }: userButtonProps) => {
  return (
    <>
      <button className="flex flex-col items-center hover:cursor-pointer">
        <img src={user.picture} alt={user.name} width={100} height={100} />
        <span>{user.name}</span>
      </button>
    </>
  );
};
