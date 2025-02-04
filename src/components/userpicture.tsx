import { User } from "@/app/page";

type UserPictureProps = {
  user: User;
};
export default function UserPicture(props: UserPictureProps) {
  return (
    <img
      alt={props.user.name}
      height={200}
      width={200}
      src={props.user.picture}
    />
  );
}
