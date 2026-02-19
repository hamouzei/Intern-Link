"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

interface Company {
    id: string;
    name: string;
    email: string;
    address: string;
    telephone: string;
    website: string;
    acceptsInterns: boolean;
}

export default function CompaniesPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const token = (session as any)?.session?.token;

    const [companies, setCompanies] = useState<Company[]>([]);
    const [search, setSearch] = useState("");
    const [onlyAccepting, setOnlyAccepting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    useEffect(() => {
        if (!isPending && !session) router.push("/");
    }, [session, isPending, router]);

    useEffect(() => {
        if (!token) return;
        fetchCompanies();
    }, [search, onlyAccepting, token]);

    async function fetchCompanies() {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (onlyAccepting) params.set("accepting", "true");
            const data = await apiRequest<Company[]>(`/companies?${params.toString()}`, {}, token);
            setCompanies(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleApply(company: Company) {
        if (!token) return;
        setApplying(company.id);
        try {
            const data = await apiRequest<{ subject: string; body: string }>(
                "/applications/generate",
                { method: "POST", body: JSON.stringify({ company_id: company.id }) },
                token
            );
            setGeneratedEmail(data);
            setSelectedCompany(company);
        } catch (e: any) {
            alert(e.message || "Failed to generate email.");
        } finally {
            setApplying(null);
        }
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            {/* Nav */}
            <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
                <span className="text-xl font-bold text-[#f5c842]">InternLink</span>
                <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-white transition">
                    ← Dashboard
                </button>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-2">Browse Companies</h1>
                <p className="text-gray-400 mb-8">Find companies accepting interns and apply with AI-generated emails.</p>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c842]/50"
                    />
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={onlyAccepting}
                            onChange={e => setOnlyAccepting(e.target.checked)}
                            className="w-4 h-4 accent-[#f5c842]"
                        />
                        <span className="text-sm text-gray-300">Accepting interns only</span>
                    </label>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#f5c842] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {companies.map(company => (
                            <div
                                key={company.id}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-lg leading-tight">{company.name}</h3>
                                    <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                                        company.acceptsInterns
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}>
                                        {company.acceptsInterns ? "✓ Accepting" : "✗ Not Accepting"}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1.5 text-sm text-gray-400">
                                    {company.address && <p>📍 {company.address}</p>}
                                    {company.telephone && <p>📞 {company.telephone}</p>}
                                    {company.website && (
                                        <p>
                                            🌐{" "}
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#f5c842] hover:underline"
                                            >
                                                {company.website.replace(/^https?:\/\/(www\.)?/, "")}
                                            </a>
                                        </p>
                                    )}
                                    {company.email && (
                                        <p>
                                            📧{" "}
                                            <a
                                                href={`mailto:${company.email}`}
                                                className="text-[#f5c842] hover:underline"
                                            >
                                                {company.email}
                                            </a>
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleApply(company)}
                                    disabled={!company.acceptsInterns || applying === company.id}
                                    className="mt-auto w-full py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed bg-[#f5c842] text-gray-900 hover:bg-[#e5b83a]"
                                >
                                    {applying === company.id ? "Generating..." : "Apply →"}
                                </button>
                            </div>
                        ))}
                        {companies.length === 0 && (
                            <p className="col-span-3 text-center text-gray-500 py-20">No companies found.</p>
                        )}
                    </div>
                )}
            </main>

            {/* Email Preview Modal */}
            {generatedEmail && selectedCompany && (
                <EmailPreviewModal
                    company={selectedCompany}
                    subject={generatedEmail.subject}
                    body={generatedEmail.body}
                    token={token}
                    onClose={() => { setGeneratedEmail(null); setSelectedCompany(null); }}
                    onSent={() => { setGeneratedEmail(null); setSelectedCompany(null); router.push("/applications"); }}
                />
            )}
        </div>
    );
}

function EmailPreviewModal({
    company, subject: initSubject, body: initBody, token, onClose, onSent
}: {
    company: Company;
    subject: string;
    body: string;
    token: string;
    onClose: () => void;
    onSent: () => void;
}) {
    const [subject, setSubject] = useState(initSubject);
    const [body, setBody] = useState(initBody);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    async function handleSend() {
        setSending(true);
        setError("");
        try {
            await apiRequest("/applications/send", {
                method: "POST",
                body: JSON.stringify({ company_id: company.id, email_subject: subject, email_body: body }),
            }, token);
            onSent();
        } catch (e: any) {
            setError(e.message || "Failed to send email.");
            setSending(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold">Email Preview</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 flex flex-col gap-5">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">To</label>
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm">{company.email}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                        <input
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f5c842]/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Body</label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={14}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f5c842]/50 resize-none font-mono"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition text-sm font-medium">
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={sending}
                            className="flex-1 py-3 rounded-xl bg-[#f5c842] text-gray-900 font-bold hover:bg-[#e5b83a] transition disabled:opacity-50 text-sm"
                        >
                            {sending ? "Sending..." : "Send Email 📬"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
