import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { events } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { error } from "console";

export async function GET(req: Request) {
  try {
    const userId = auth();
    if (!userId) {
      return NextResponse.json({ error: "not allowed" }, { status: 401 });
    }

    const events = await db.query.events.findMany();

    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}