import { API_URL, REFETCH_MEMEBRS_ROUTE, USERS_ROUTE } from "./constants";
import { User } from "./interfaces";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}${USERS_ROUTE}`);
  let data: User[] = [];
  try {
    const res = (await response.json()) as { users: User[] };
    data = res.users;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const refetchActiveMembers = async () => {
  const res = await fetch(`${API_URL}${REFETCH_MEMEBRS_ROUTE}`);
  if (res.status === 200) {
    return true;
  }
  return false;
};
