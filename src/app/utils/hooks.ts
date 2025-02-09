import {
  API_URL,
  BRUS_COST,
  BrusType,
  BUY_BRUS_ROUTE,
  REFETCH_MEMEBRS_ROUTE,
  USERS_ROUTE,
} from "./constants";
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

export const buyBrus = async (
  brusType: BrusType,
  buyerBrusName: string,
  brusAmount: number
) => {
  if (!BRUS_COST[brusType] || brusAmount < 1) {
    return false;
  }

  const res = await fetch(`${API_URL}${BUY_BRUS_ROUTE}`, {
    method: "POST",
    body: JSON.stringify({ brusType, buyerBrusName, brusAmount }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const updatedUser = await res.json().then((data) => data.updatedUser);
  if (!updatedUser) return false;
  return updatedUser;
};
