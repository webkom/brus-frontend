"use client";
import FullscreenTrigger from "./components/FullscreenTrigger";
import UserGrid from "./components/UserGrid";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <FullscreenTrigger />
      <h1 className="text-4xl text-center">BRUUUUUUUUUSSSS baby</h1>
      <UserGrid />
    </div>
  );
}
