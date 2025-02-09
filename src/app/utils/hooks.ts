import {
  API_URL,
  BRUS_COST,
  BrusType,
  BUY_BRUS_ROUTE,
  REFETCH_MEMEBRS_ROUTE,
  REFILL_BRUS_ROUTE,
  USERS_ROUTE,
} from "./constants";
import { BuyRefillBrusRequest, User } from "./interfaces";

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

export const buyBrus = async ({
  brusAmount,
  brusType,
  userBrusName,
}: BuyRefillBrusRequest) => {
  if (!BRUS_COST[brusType] || brusAmount < 1) {
    return false;
  }

  const res = await fetch(`${API_URL}${BUY_BRUS_ROUTE}`, {
    method: "POST",
    body: JSON.stringify({ brusType, userBrusName, brusAmount }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const updatedUser = await res.json().then((data) => data.updatedUser);
  if (!updatedUser) return false;
  return updatedUser;
};

export const refillBrus = async ({
  brusType,
  brusAmount,
  userBrusName,
}: BuyRefillBrusRequest) => {
  if (!BRUS_COST[brusType] || brusAmount < 1) {
    return false;
  }

  const res = await fetch(`${API_URL}${REFILL_BRUS_ROUTE}`, {
    method: "POST",
    body: JSON.stringify({
      brusType: brusType,
      userBrusName: userBrusName,
      brusAmount: brusAmount,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const updatedUser = await res.json().then((data) => data.updatedUser);
  if (!updatedUser) return false;
  return updatedUser;
};
