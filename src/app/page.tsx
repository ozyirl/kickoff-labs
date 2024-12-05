"use client";
import { useState } from "react";
import { MoveUpRight } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function HomePage() {
  const { user } = useUser();

  return (
    <>
      <SignedOut>
        <div className="font-semibold flex text-3xl items-center justify-center h-screen flex-col gap-2 p-4">
          <Button variant={"default"}>
            <SignInButton />
          </Button>
          <h1 className="text-center text-4xl font-black">It’s time.</h1>
          <p className="text-center p-2 font-medium text-lg">
            All of your commitments, now in one <br />
            place. Meet the beautifully designed,
            <br /> fully integrated calendar for your work and life.
          </p>
          <ModeToggle />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="flex flex-row p-4 text-4xl font-semibold text-white">
            hey {user?.firstName}
            <div className="p-2 -mt-1">
              <UserButton />
            </div>
          </h1>
          <div>
            <Button variant={"default"} asChild>
              <Link href="/dashboard">
                Dashboard <MoveUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
