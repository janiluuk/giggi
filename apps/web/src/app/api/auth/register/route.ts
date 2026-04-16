import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/server/db";

export const runtime = "nodejs";

const registerSchema = z.object({
  nickname: z.string().min(2).max(32),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findFirst({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.nickname,
      nickname: parsed.data.nickname,
      email: parsed.data.email,
      passwordHash,
      profile: { create: {} },
    },
    select: { id: true },
  });

  return NextResponse.json({ userId: user.id }, { status: 201 });
}

