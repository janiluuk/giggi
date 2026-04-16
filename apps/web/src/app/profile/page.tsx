import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      nickname: true,
      name: true,
      isPhoneVerified: true,
      profile: {
        select: { bio: true, skills: true, visibilityLevel: true },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-2 text-sm text-zinc-700">
        Signed in as{" "}
        <span className="font-medium">{user?.nickname ?? user?.name ?? "—"}</span>.{" "}
        {user?.isPhoneVerified ? (
          <span className="text-green-700">Phone verified.</span>
        ) : (
          <span className="text-amber-700">Phone not verified yet.</span>
        )}
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <ProfileForm
          initial={{
            bio: user?.profile?.bio ?? null,
            skills: user?.profile?.skills ?? [],
            visibilityLevel: user?.profile?.visibilityLevel ?? "PUBLIC",
          }}
        />
      </div>
    </div>
  );
}

