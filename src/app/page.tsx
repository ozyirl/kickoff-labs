"use client";
import { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { User } from "@clerk/nextjs/server";
import { getPosts } from "@/actions/actions";
export default function HomePage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<any>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
      .catch(console.error);
  }, []);

  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <h1 className="flex h-screen flex-row items-center justify-center p-4 text-4xl font-semibold text-white">
          {posts?.name} {user?.firstName}
          <div className="p-2">
            <UserButton />
          </div>
        </h1>
      </SignedIn>
    </>
  );
}
