import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ user: null }, { status: 200 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      email: true,
      phone: true,
      isPhoneVerified: true,
      profile: {
        select: {
          bio: true,
          skills: true,
          resumeData: true,
          visibilityLevel: true,
        },
      },
    },
  });

  return NextResponse.json({ user }, { status: 200 });
}

