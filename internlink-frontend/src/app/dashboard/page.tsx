"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) router.push("/");
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
                <div className="w-8 h-8 border-2 border-[#f5c842] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const user = session?.user;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            {/* Topbar */}
            <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
                <span className="text-xl font-bold text-[#f5c842]">InternLink</span>
                <div className="flex items-center gap-4">
                    {user?.image && (
                        <img src={user.image} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
                    )}
                    <span className="text-sm text-gray-300">{user?.name}</span>
                    <button
                        onClick={() => signOut()}
                        className="text-sm text-gray-500 hover:text-white transition"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-16">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, <span className="text-[#f5c842]">{user?.name?.split(" ")[0]}</span> 👋
                </h1>
                <p className="text-gray-400 mb-12">What would you like to do today?</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashCard
                        href="/complete-profile"
                        emoji="👤"
                        title="Complete Profile"
                        desc="Fill in your university, role, and upload your documents."
                        cta="Go to Profile"
                    />
                    <DashCard
                        href="/companies"
                        emoji="🏢"
                        title="Browse Companies"
                        desc="Discover companies accepting interns and apply with one click."
                        cta="Browse Companies"
                        highlight
                    />
                    <DashCard
                        href="/applications"
                        emoji="📋"
                        title="My Applications"
                        desc="View the history of all emails you've sent through InternLink."
                        cta="View Applications"
                    />
                </div>
            </main>
        </div>
    );
}

function DashCard({
    href, emoji, title, desc, cta, highlight,
}: {
    href: string; emoji: string; title: string; desc: string; cta: string; highlight?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group p-7 rounded-2xl border transition-all duration-300 flex flex-col gap-4 ${
                highlight
                    ? "bg-[#f5c842]/10 border-[#f5c842]/30 hover:border-[#f5c842]"
                    : "bg-white/5 border-white/10 hover:border-white/30"
            }`}
        >
            <div className="text-3xl">{emoji}</div>
            <div>
                <h3 className={`text-lg font-bold mb-1 ${highlight ? "text-[#f5c842]" : "text-white"}`}>{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
            <span className={`text-sm font-semibold mt-auto ${highlight ? "text-[#f5c842]" : "text-gray-300"} group-hover:underline`}>
                {cta} →
            </span>
        </Link>
    );
}
