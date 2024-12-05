import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { events } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauth" }, { status: 401 });
    }

    const { id, title, description, startTime, endTime } = await req.json();

    if (!id || !title || !startTime || !endTime) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Updating event with ID:", id);

    const updatedEvent = await db
      .update(events)
      .set({
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      })
      .where(and(eq(events.id, id), eq(events.createdBy, userId)))
      .returning();

    if (!updatedEvent) {
      console.error("Event not found or not authorized:", id);
      return NextResponse.json(
        { message: "Event not found or not authorized" },
        { status: 404 }
      );
    }

    console.log("Event updated successfully:", updatedEvent);
    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
