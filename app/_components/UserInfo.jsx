"use client";

import { useSession } from "next-auth/react";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export function UserInfo({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-[#85766a]">Loading...</div>;
  }

  // Check if user exists
  if (!session?.user) {
    return <div className="text-sm text-[#5c4b3e]">Not signed in</div>;
  }

  const isGoogleProvider =
    session?.provider === "google" || session?.user?.provider === "google";

  return (
    <div className="flex items-center gap-3">
      {isGoogleProvider ? (
        <div className="h-8 w-8 bg-[#decea0] rounded-full flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-[#5c4b3e]" />
        </div>
      ) : session.user.image ? (
        <Link href="studio/me">
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="h-8 w-8 rounded-full"
          />
        </Link>
      ) : (
        <div className="h-8 w-8 bg-[#decea0] rounded-full flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-[#5c4b3e]" />
        </div>
      )}
      <div className="text-sm">
        <button>
          <Link href="studio/me">
            <span className="font-bold text-[#5c4b3e]">
              {session.user.name}
            </span>
          </Link>
        </button>
      </div>
      {children}
    </div>
  );
}

export default UserInfo;
