"use client";

import { signIn } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) router.push("/dashboard");
    }, [session, router]);

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
                <div className="w-8 h-8 border-2 border-[#f5c842] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
                <span className="text-xl font-bold tracking-tight text-primary">InternLink</span>
                <div className="flex gap-3">
                    <button
                        onClick={() => signIn.social({ provider: "google" })}
                        className="px-5 py-2 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="flex flex-col items-center text-center px-6 pt-28 pb-20">
                <div className="mb-5 inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                    AI-Powered Internship Applications
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold leading-none mb-6 text-foreground max-w-4xl tracking-tight">
                    Generate. Apply.<br />
                    <span className="text-primary">Land the Offer.</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-xl mb-12 leading-relaxed">
                    Stop sending generic emails. InternLink uses AI to craft highly personalized internship applications, seamlessly sending your CV while tracking your progress—putting your internship search on autopilot.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => signIn.social({ provider: "google" })}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-[#B45309] transition-all duration-200 active:scale-[0.98] text-base w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                    <button
                        onClick={() => signIn.social({ provider: "github" })}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-[#2A2A2A] text-foreground font-semibold rounded-xl hover:bg-white/5 transition-all duration-200 active:scale-[0.98] text-base w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        Continue with GitHub
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-5xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { emoji: "🎯", title: "Profile Once", desc: "Set up your profile and upload your CV. Reuse it for every application." },
                    { emoji: "🤖", title: "AI Emails", desc: "Personalized, professional emails tailored to each company, generated in seconds." },
                    { emoji: "📬", title: "One-Click Send", desc: "Preview, edit if needed, and send with attachments straight from the platform." },
                ].map((f) => (
                    <div key={f.title} className="p-7 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors duration-300">
                        <div className="text-3xl mb-4">{f.emoji}</div>
                        <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </section>
            {/* How It Works Section */}
            <section className="bg-[#0A0A0A] py-32 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-primary font-medium tracking-wide text-sm uppercase mb-3 block">Process</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">How It Works</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Three simple steps to supercharge your internship search and land the role you deserve.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent"></div>

                        {[
                            {
                                step: "01.",
                                title: "Build Your Profile",
                                desc: "Upload your CV and support letter once. Tell us your target role and let InternLink handle the rest."
                            },
                            {
                                step: "02.",
                                title: "Match & Generate",
                                desc: "Browse curated top companies. Click 'Apply', and our AI instantly drafts a perfectly tailored cover letter."
                            },
                            {
                                step: "03.",
                                title: "Send & Connect",
                                desc: "Send applications directly from the platform. Replies from HR come straight to your unified dashboard inbox."
                            }
                        ].map((s, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-[90px] h-[90px] rounded-full bg-[#111] border border-border flex items-center justify-center text-2xl font-black text-primary/80 mb-8 shadow-xl group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 relative">
                                    <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                                    <span className="relative z-10">{s.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-4">{s.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Box */}
            <section className="py-24 px-6 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-surface/80 to-background border border-border/50 p-12 md:p-20 text-center shadow-2xl">
                        {/* Background Glows */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight max-w-3xl mx-auto leading-tight">
                                Ready to Land Your <br className="hidden md:block" /> Dream Internship?
                            </h2>
                            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of students who have automated their internship search and landed offers at top companies.
                            </p>
                            
                            <button
                                onClick={() => signIn.social({ provider: "google" })}
                                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-[#B45309] transition-all duration-300 active:scale-[0.98] shadow-xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                <span className="relative z-10 text-lg">Get Started For Free</span>
                                <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
