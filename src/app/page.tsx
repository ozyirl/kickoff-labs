"use client";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function HomePage() {
  const { user } = useUser();

  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <h1 className="flex h-screen flex-row items-center justify-center p-4 text-4xl font-semibold text-white">
          {user?.firstName}
          <div className="p-2">
            <UserButton />
          </div>
        </h1>
      </SignedIn>
    </>
  );
}
