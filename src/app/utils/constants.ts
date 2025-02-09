export const MEMBERS_URL = "https://members.webkom.dev/";
export const FETCH_MEMEBRS_ROUTE = "/fetchactivemembers";
export const ADD_USERS_ROUTE = "/addusers";
export const USERS_ROUTE = "/users";

export const DEV_MODE = false;
export const API_URL = DEV_MODE
  ? "http://localhost:3000/api"
  : process.env.NEXT_PUBLIC_API_URL;

export const BRUS_COST = 31;
