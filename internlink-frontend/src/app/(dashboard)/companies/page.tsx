"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            toast.error(e.message || "Failed to generate email.");
        } finally {
            setApplying(null);
        }
    }

    if (isPending) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Browse Companies</h1>
                <p className="text-muted-foreground mt-2 text-lg">Find companies accepting interns and apply with AI-generated emails.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search companies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 h-12 text-base"
                    />
                </div>
                <label className="flex items-center gap-3 px-4 h-12 rounded-xl bg-surface border border-border cursor-pointer select-none ring-offset-background focus-within:ring-2 focus-within:ring-primary">
                    <input
                        type="checkbox"
                        checked={onlyAccepting}
                        onChange={e => setOnlyAccepting(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded border-border"
                    />
                    <span className="text-sm font-medium text-foreground">Accepting Interns Only</span>
                </label>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="h-64 flex flex-col p-6">
                            <Skeleton className="w-2/3 h-6 mb-2" />
                            <Skeleton className="w-1/3 h-4 mb-6" />
                            <div className="space-y-2 mb-auto">
                                <Skeleton className="w-3/4 h-4" />
                                <Skeleton className="w-1/2 h-4" />
                            </div>
                            <Skeleton className="w-full h-10 mt-auto" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map(company => (
                        <Card
                            key={company.id}
                            className="flex flex-col h-full hover:border-primary/50 transition-colors duration-300"
                        >
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-start gap-3 mb-4">
                                    <h3 className="font-bold text-lg leading-tight text-foreground">{company.name}</h3>
                                    {company.acceptsInterns ? (
                                        <Badge variant="success" className="shrink-0 rounded-md">Accepting</Badge>
                                    ) : (
                                        <Badge variant="danger" className="shrink-0 rounded-md">Closed</Badge>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6 flex-1">
                                    {company.address && <p className="line-clamp-2">📍 {company.address}</p>}
                                    {company.telephone && <p>📞 {company.telephone}</p>}
                                    {company.website && (
                                        <p>🌐 <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website.replace(/^https?:\/\/(www\.)?/, "")}</a></p>
                                    )}
                                    {company.email && (
                                        <p>📧 <a href={`mailto:${company.email}`} className="text-primary hover:underline truncate block">{company.email}</a></p>
                                    )}
                                </div>
                                
                                <Button
                                    onClick={() => handleApply(company)}
                                    disabled={!company.acceptsInterns || applying === company.id}
                                    className="w-full mt-auto"
                                    variant="primary"
                                >
                                    {applying === company.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Crafting...
                                        </>
                                    ) : (
                                        "Apply Now"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {companies.length === 0 && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
                            <p className="text-muted-foreground text-lg">No companies found matching your search.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Email Preview Modal */}
            <AnimatePresence>
                {generatedEmail && selectedCompany && (
                    <EmailPreviewModal
                        company={selectedCompany}
                        subject={generatedEmail.subject}
                        body={generatedEmail.body}
                        token={token}
                        onClose={() => { setGeneratedEmail(null); setSelectedCompany(null); }}
                        onSent={() => { 
                            setGeneratedEmail(null); 
                            setSelectedCompany(null); 
                            toast.success("Email sent successfully 🚀");
                            router.push("/applications"); 
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
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

    async function handleSend() {
        setSending(true);
        try {
            await apiRequest("/applications/send", {
                method: "POST",
                body: JSON.stringify({ company_id: company.id, email_subject: subject, email_body: body }),
            }, token);
            onSent();
        } catch (e: any) {
            toast.error(e.message || "Failed to send email.");
            setSending(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-surface border border-border rounded-xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
                    <h2 className="text-lg font-semibold text-foreground">Review Application</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition text-xl leading-none">&times;</button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">To</label>
                        <div className="px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-medium">
                            {company.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Subject</label>
                        <Input
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="font-medium"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Message Body</label>
                        <Textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={14}
                            className="font-mono text-sm leading-relaxed resize-none h-64"
                        />
                    </div>
                </div>

                <div className="p-6 pt-4 border-t border-border bg-surface/50 flex gap-3">
                    <Button onClick={onClose} variant="secondary" className="flex-1" disabled={sending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={sending}
                        variant="primary"
                        className="flex-1"
                    >
                        {sending ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                        ) : (
                            <><Send className="w-4 h-4 mr-2" /> Send Application</>
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
