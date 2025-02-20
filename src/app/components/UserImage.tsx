import React from "react";
import Image from "next/image";
import { User } from "../utils/interfaces";
interface UserImageProps {
  user: User;
  size?: number;
}

const UserImage = ({ user, size }: UserImageProps) => {
  return (
    <>
      <Image
        draggable={false}
        src={user.avatar}
        alt={user.name}
        width={size || 100}
        height={size || 100}
        className="rounded-sm"
      />
    </>
  );
};

export default UserImage;
