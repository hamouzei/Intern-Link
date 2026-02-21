"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle goes here when adding mobile nav */}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-foreground hidden sm:block">
          {session?.user?.name || "Welcome"}
        </div>
        
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-medium text-primary">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface rounded-xl transition"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
