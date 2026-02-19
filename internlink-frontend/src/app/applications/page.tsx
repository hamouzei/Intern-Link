"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type Application = {
    id: string;
    companyName: string;
    status: string;
    sentAt: string;
    roleApplied: string;
};

export default function ApplicationsPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const token = (session as any)?.session?.token;

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isPending && !session) router.push("/");
    }, [session, isPending, router]);

    useEffect(() => {
        if (!token) return;
        fetchApplications();
    }, [token]);

    async function fetchApplications() {
        try {
            const data = await apiRequest<Application[]>("/applications", {}, token);
            setApplications(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
                <span className="text-xl font-bold text-[#f5c842]">InternLink</span>
                <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-white transition">
                    ← Dashboard
                </button>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-2">Application History</h1>
                <p className="text-gray-400 mb-10">Track all the internship applications you've sent.</p>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#f5c842] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
                        <p className="text-gray-500 mb-4">You haven't applied to any companies yet.</p>
                        <button
                            onClick={() => router.push("/companies")}
                            className="px-6 py-3 bg-[#f5c842] text-gray-900 font-bold rounded-xl hover:bg-[#e5b83a] transition"
                        >
                            Browse Companies
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {applications.map(app => (
                            <div key={app.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{app.companyName}</h3>
                                    <p className="text-sm text-gray-400">Role: {app.roleApplied}</p>
                                    <p className="text-xs text-gray-500 mt-1">Sent on {new Date(app.sentAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 capitalize">
                                        ● {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
