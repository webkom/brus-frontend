import {
  ADD_USERS_ROUTE,
  API_URL,
  FETCH_MEMEBRS_ROUTE,
  USERS_ROUTE,
} from "./constants";
import { User } from "./interfaces";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}${USERS_ROUTE}`);
  let data: User[] = [];
  try {
    data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addUsers = async () => {
  const members = await fetch(`${API_URL}${FETCH_MEMEBRS_ROUTE}`);
  const users = (await members.json()) as { members: User[] };
  const res = await fetch(`${API_URL}${ADD_USERS_ROUTE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(users),
  });

  if (res.status === 200) {
    return true;
  }
  return false;
};
