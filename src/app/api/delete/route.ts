import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { events } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest) {
  try {
    const userId = auth();
    if (!userId) {
      return NextResponse.json({ error: "unauth" }, { status: 401 });
    }
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing event ID" },
        { status: 400 }
      );
    }

    console.log("Deleting event with ID:", id);

    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();

    if (!deletedEvent) {
      console.error("Event not found with ID:", id);
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    console.log("Event deleted successfully:", deletedEvent);
    return NextResponse.json(
      { message: "Event deleted successfully", event: deletedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
