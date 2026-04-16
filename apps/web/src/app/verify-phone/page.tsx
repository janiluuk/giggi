import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { VerifyPhoneForm } from "./VerifyPhoneForm";

export default async function VerifyPhonePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Verify your phone</h1>
      <p className="mt-2 text-sm text-zinc-700">
        Phone verification upgrades you to Tier 2 capabilities in the MVP.
      </p>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <VerifyPhoneForm />
      </div>
    </div>
  );
}

