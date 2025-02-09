export const MEMBERS_URL = "https://members.webkom.dev/";
export const REFETCH_MEMEBRS_ROUTE = "/refetch_active_members";
export const USERS_ROUTE = "/users";

export const DEV_MODE = false; // Set to true to use local API
export const API_URL = DEV_MODE
  ? "http://localhost:3000/api"
  : process.env.NEXT_PUBLIC_API_URL;

export const BRUS_COST = 31;
