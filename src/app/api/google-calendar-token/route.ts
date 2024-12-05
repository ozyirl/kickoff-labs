import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const provider = "oauth_google";

    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
      userId,
      provider
    );

    if (!clerkResponse || clerkResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Google account not connected" },
        { status: 404 }
      );
    }

    const accessToken = clerkResponse.data[0].token;

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json(
      { error: "Failed to retrieve OAuth token", details: error },
      { status: 500 }
    );
  }
}
