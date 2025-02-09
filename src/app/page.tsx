"use client";
import { useEffect, useState } from "react";
import { User } from "./utils/interfaces";
import { UserButton } from "./components/UserButton";
import {
  ADD_USERS_ROUTE,
  API_URL,
  FETCH_MEMEBRS_ROUTE,
  USERS_ROUTE,
} from "./utils/constants";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    console.log("fetching users");
    const response = await fetch(`${API_URL}${USERS_ROUTE}`);
    const data = await response.json();
    setUsers(data);
  };

  const addUsers = async () => {
    const members = await fetch(`${API_URL}${FETCH_MEMEBRS_ROUTE}`);
    const users = (await members.json()) as { members: User[] };
    await fetch(`${API_URL}${ADD_USERS_ROUTE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });
  };

  useEffect(() => {
    addUsers();
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-center">BRUUUUUUUUUSSSS baby</h1>
      <div className="grid grid-cols-5 gap-4 p-4 sm:grid-cols-5 max-w-200 m-auto">
        {users.map((user) => (
          <>
            <UserButton user={user} />
          </>
        ))}
      </div>
    </div>
  );
}
