"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Send, User } from "lucide-react";
import { cn } from "@/lib/utils"; // Wait, I need to check if they have cn in lib/utils. If not, I should create it or just use inline logic. Let me use clsx/tailwind-merge.

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Applications", href: "/applications", icon: Send },
  { name: "Profile", href: "/complete-profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border hidden md:flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
          {/* Subtle branding glow */}
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-white text-xs">IL</span>
          </div>
          InternLink
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {/* Simple placeholder for settings or logout; handled in topbar later but good to have a space */}
        <div className="text-xs text-muted-foreground text-center">
          &copy; 2026 InternLink
        </div>
      </div>
    </aside>
  );
}
