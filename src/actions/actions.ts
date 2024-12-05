"use server";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export async function getPosts() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const post = await db.query.posts.findFirst();

  return post;
}
