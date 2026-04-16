import crypto from "node:crypto";

import { prisma } from "@/server/db";
import { getSmsProvider } from "@/server/sms";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function randomCode6() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function startPhoneVerification(args: { userId: string; phoneE164: string }) {
  const ttlSeconds = Number(process.env.PHONE_VERIFICATION_CODE_TTL_SECONDS ?? "600");
  const code = randomCode6();
  const codeHash = sha256(`${args.userId}:${args.phoneE164}:${code}`);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  await prisma.phoneVerificationCode.create({
    data: {
      userId: args.userId,
      phone: args.phoneE164,
      codeHash,
      expiresAt,
    },
  });

  const sms = getSmsProvider();
  await sms.sendVerificationCode({
    toPhoneE164: args.phoneE164,
    message: `Your Giggi verification code is ${code}. It expires in ${Math.ceil(ttlSeconds / 60)} min.`,
  });

  return {
    expiresAt,
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  };
}

export async function verifyPhoneCode(args: { userId: string; phoneE164: string; code: string }) {
  const codeHash = sha256(`${args.userId}:${args.phoneE164}:${args.code}`);
  const now = new Date();

  const record = await prisma.phoneVerificationCode.findFirst({
    where: {
      userId: args.userId,
      phone: args.phoneE164,
      codeHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return { ok: false as const };

  await prisma.$transaction([
    prisma.phoneVerificationCode.update({
      where: { id: record.id },
      data: { usedAt: now },
    }),
    prisma.user.update({
      where: { id: args.userId },
      data: { phone: args.phoneE164, isPhoneVerified: true },
    }),
  ]);

  return { ok: true as const };
}

