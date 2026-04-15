import { NextResponse } from "next/server";

import { env } from "../../../env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    aiProvider: env.AI_PROVIDER
  });
}

