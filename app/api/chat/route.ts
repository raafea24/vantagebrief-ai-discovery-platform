import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    {
      error: {
        code: "NOT_IMPLEMENTED",
        message: "The discovery service is not available yet.",
      },
    },
    { status: 501 },
  );
}
