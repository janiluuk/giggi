import { NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

const updateSchema = z.object({
  bio: z.string().max(500).nullable().optional(),
  skills: z.array(z.string().min(1).max(40)).max(30).optional(),
  resumeData: z.unknown().nullable().optional(),
  visibilityLevel: z.enum(["PUBLIC", "HIDDEN"]).optional(),
});

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  return NextResponse.json({ profile }, { status: 200 });
}

export async function PUT(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const data = {
    ...parsed.data,
    resumeData:
      parsed.data.resumeData === null
        ? Prisma.JsonNull
        : (parsed.data.resumeData as Prisma.InputJsonValue | undefined),
  };

  const profile = await prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  return NextResponse.json({ profile }, { status: 200 });
}

