"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "./utils/interfaces";
import { UserButton } from "./components/UserButton";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:3000/api"}/users`
    );
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-center">BRUUUUUUUUUSSSS baby</h1>
      <div className="grid grid-cols-5 gap-4 p-4 sm:grid-cols-5 max-w-200 m-auto">
        {users.map((user) => (
          <>
            <UserButton user={user} />
            <UserButton user={user} />
            <UserButton user={user} />
            <UserButton user={user} />
          </>
        ))}
      </div>
    </div>
  );
}
