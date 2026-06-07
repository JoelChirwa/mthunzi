"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="h-16 border-b flex items-center justify-between px-4 sm:px-6 md:px-8">

      <div className="hidden sm:block">
        <h2 className="font-semibold text-sm sm:text-base">Admin Dashboard</h2>
        {session?.user?.email && (
          <p className="text-xs sm:text-sm text-slate-500">{session.user.email}</p>
        )}
      </div>

      <div className="flex items-center gap-6">

        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </Button>

      </div>

    </div>

  );
}