"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { MoveRight, Calendar, Building, Send, Briefcase } from "lucide-react";
import Link from "next/link";

type Application = {
    id: string;
    companyName: string;
    companyId: string; // The backend returns companyId currently as companyName based on previous logic, adjusting to handle gracefully
    createdAt: string; // Backend actually sends createdAt instead of sentAt based on Dashboard logic
    status: string;
    roleApplied?: string;
};

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (isPending) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
        >
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Application History</h1>
                <p className="text-muted-foreground mt-2 text-lg">Track all the internship applications you've sent through InternLink.</p>
            </div>

            {loading ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-muted-foreground">
                                <Skeleton className="w-5 h-5 rounded-full" />
                            </div>
                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                                <Skeleton className="w-1/2 h-6 mb-2" />
                                <Skeleton className="w-3/4 h-4 mb-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </Card>
                        </div>
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-6">
                            <Send className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">No Applications Yet</h2>
                        <p className="text-muted-foreground mb-8 max-w-sm">You haven't sent any internship applications yet. Browse out our curated list of companies to get started.</p>
                        <Link href="/companies">
                            <Button variant="primary" size="lg">
                                Browse Companies <MoveRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <motion.div 
                    variants={containerVars}
                    initial="hidden"
                    animate="show"
                    className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent"
                >
                    {applications.map((app) => (
                        <motion.div variants={itemVars} key={app.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Icon inside the timeline line */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
                                <Building className="w-4 h-4" />
                            </div>
                            
                            {/* Card content */}
                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:border-primary/50 transition-colors duration-300">
                                <CardContent className="p-5 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-bold text-lg text-foreground leading-tight">
                                            {app.companyName || app.companyId}
                                        </h3>
                                        <StatusBadge status={app.status || "sent"} />
                                    </div>
                                    
                                    <div className="space-y-1.5 mt-1">
                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            <span>Role: {app.roleApplied || "General Application"}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(app.createdAt || new Date()).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    
    if (s === "accepted" || s === "interviewing") {
        return <Badge variant="success" className="capitalize shrink-0">{status}</Badge>;
    }
    
    if (s === "rejected" || s === "declined") {
        return <Badge variant="danger" className="capitalize shrink-0">{status}</Badge>;
    }
    
    // Default (sent, pending, etc)
    return <Badge variant="default" className="capitalize shrink-0 bg-primary/10 text-primary border-primary/20">{status}</Badge>;
}
