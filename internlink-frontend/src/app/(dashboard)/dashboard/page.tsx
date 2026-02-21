"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { FileText, Building2, Send } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({ applications: 0, companies: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/");
    }
  }, [session, sessionPending, router]);

  useEffect(() => {
    if (!session) return;
    
    async function fetchData() {
      try {
        const token = (session as any)?.session?.token;
        const [apps, comps] = await Promise.all([
          apiRequest<any[]>("/applications", undefined, token),
          apiRequest<any[]>("/companies", undefined, token),
        ]);
        
        setStats({
          applications: apps.length,
          companies: comps.length,
        });
        
        // Take top 5 recent
        setRecentApps(apps.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [session]);

  if (sessionPending) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ready to launch your next opportunity?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Applications Sent" 
          value={isLoading ? null : stats.applications} 
          icon={<Send className="w-5 h-5 text-primary" />} 
        />
        <StatsCard 
          title="Pending Responses" 
          value={isLoading ? null : stats.applications} // Mocking pending as all for now
          icon={<FileText className="w-5 h-5 text-[#15803D]" />} 
        />
        <StatsCard 
          title="Companies Available" 
          value={isLoading ? null : stats.companies} 
          icon={<Building2 className="w-5 h-5 text-primary" />} 
        />
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Applications</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-surface/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    </tr>
                  ))
                ) : recentApps.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                      No applications sent yet. <Link href="/companies" className="text-primary hover:underline">Start browsing companies</Link>.
                    </td>
                  </tr>
                ) : (
                    recentApps.map((app) => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{app.companyName || app.companyId || "Unknown Company"}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Pending"}
                        </td>
                        <td className="px-6 py-4">
                        <Badge variant="default">Sent</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: number | null; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-8 w-16 mt-1" />
        ) : (
          <div className="text-3xl font-bold text-foreground mt-1">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
