import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/server/auth";
import { verifyPhoneCode } from "@/server/phoneVerification";

export const runtime = "nodejs";

const schema = z.object({
  phoneE164: z.string().regex(/^\+\d{7,20}$/),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await verifyPhoneCode({
    userId,
    phoneE164: parsed.data.phoneE164,
    code: parsed.data.code,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

