import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { events } from "@/server/db/schema";

export async function POST(req: Request) {
  try {
    const userId = auth();
    if (!userId) {
      return NextResponse.json({ error: "unauth" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, startTime, endTime } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json({ error: "title missing" }, { status: 400 });
    }

    const newEvent = await db.insert(events).values({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    return NextResponse.json(
      {
        message: "success",
        newEvent,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("failed", err);
  }
}
