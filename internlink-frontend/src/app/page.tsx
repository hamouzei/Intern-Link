"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [comparisonTab, setComparisonTab] = useState<"ai" | "generic">("ai");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        if (session) router.push("/dashboard");
    }, [session, router]);

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#000000]">
                <div className="w-8 h-8 border-2 border-[#737373] border-t-[#FAFAFA] rounded-full animate-spin" />
            </div>
        );
    }

    const faqs = [
        {
            q: "How does InternLink personalize applications?",
            a: "InternLink merges your verified profile (projects, skills, GitHub) with company tech stacks and active requirements to generate bespoke, role-specific pitches."
        },
        {
            q: "Can I edit the draft before sending?",
            a: "Yes. Every generated email opens in a full markdown editor allowing you to review, personalize, or regenerate before dispatching."
        },
        {
            q: "How are my CV and University letters attached?",
            a: "Documents are uploaded once to private CDN storage and automatically included as clean, high-speed verified attachments."
        },
        {
            q: "Are applications tracked?",
            a: "Yes. Every dispatched email is logged with company recipient, timestamp, exact body text, and attachments in your unified dashboard."
        },
        {
            q: "Is InternLink free for students?",
            a: "Yes. InternLink is completely free for university students and independent developers."
        }
    ];

    return (
        <main className="min-h-screen bg-[#000000] text-[#FAFAFA] selection:bg-[#171717] selection:text-[#FAFAFA]">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#000000]/80 border-b border-[#171717]">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] text-[#000000] flex items-center justify-center font-bold text-sm">
                            IL
                        </div>
                        <span className="text-base font-bold tracking-tight text-[#FAFAFA]">
                            InternLink
                        </span>
                    </a>

                    <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#737373]">
                        <a href="#how-it-works" className="hover:text-[#FAFAFA] transition-colors">How It Works</a>
                        <a href="#comparison" className="hover:text-[#FAFAFA] transition-colors">Comparison</a>
                        <a href="#features" className="hover:text-[#FAFAFA] transition-colors">Features</a>
                        <a href="#faq" className="hover:text-[#FAFAFA] transition-colors">FAQ</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => signIn.social({ provider: "google" })}
                            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-[#D4D4D4] hover:text-[#FAFAFA] transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => signIn.social({ provider: "google" })}
                            className="px-4 py-2 text-xs font-semibold bg-[#FAFAFA] text-[#000000] rounded-lg hover:bg-[#D4D4D4] transition-colors active:scale-[0.98]"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Short & Precise Hero Section */}
            <section className="pt-20 md:pt-28 pb-16 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0A] border border-[#171717] text-[#D4D4D4] text-xs font-mono mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FAFAFA]" />
                    AI Application Engine
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#FAFAFA] mb-5 leading-[1.1]">
                    Land your next internship.
                    <br />
                    <span className="text-[#737373]">Automated with AI.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#737373] max-w-lg mb-8 leading-relaxed">
                    Generate personalized applications tailored to company tech stacks and dispatch directly to recruiters.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-12">
                    <button
                        onClick={() => signIn.social({ provider: "google" })}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 bg-[#FAFAFA] text-[#000000] font-semibold rounded-xl hover:bg-[#D4D4D4] transition-colors text-sm w-full sm:w-auto"
                    >
                        <span>Continue with Google</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>

                    <button
                        onClick={() => signIn.social({ provider: "github" })}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 bg-[#0A0A0A] text-[#FAFAFA] font-medium rounded-xl border border-[#171717] hover:border-[#737373] transition-colors text-sm w-full sm:w-auto"
                    >
                        <span>Continue with GitHub</span>
                    </button>
                </div>

                <div className="flex items-center gap-6 sm:gap-10 text-xs text-[#737373] font-mono border-t border-[#171717] pt-6">
                    <span>15+ Tech Leaders</span>
                    <span>•</span>
                    <span>5x Higher Reply Rate</span>
                    <span>•</span>
                    <span>1-Click Dispatch</span>
                </div>
            </section>

            {/* Interactive Showcase / Comparison Section */}
            <section id="comparison" className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] mb-2">
                        Why Generic Outreach Fails
                    </h2>
                    <p className="text-sm text-[#737373]">
                        Compare generic cold emails against tailored InternLink applications.
                    </p>

                    <div className="inline-flex p-1 rounded-xl bg-[#0A0A0A] border border-[#171717] mt-6 gap-1.5">
                        <button
                            onClick={() => setComparisonTab("ai")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                comparisonTab === "ai"
                                    ? "bg-[#FAFAFA] text-[#000000]"
                                    : "text-[#737373] hover:text-[#FAFAFA]"
                            }`}
                        >
                            Tailored Pitch
                        </button>
                        <button
                            onClick={() => setComparisonTab("generic")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                comparisonTab === "generic"
                                    ? "bg-[#171717] text-[#FAFAFA]"
                                    : "text-[#737373] hover:text-[#FAFAFA]"
                            }`}
                        >
                            Generic Cold Email
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl bg-[#0A0A0A] border border-[#171717] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[#171717] flex items-center justify-between text-xs font-mono text-[#737373]">
                        <span>{comparisonTab === "ai" ? "internlink_preview.eml" : "cold_template.eml"}</span>
                        <span className="text-[#D4D4D4]">
                            {comparisonTab === "ai" ? "78% Response Rate" : "9% Response Rate"}
                        </span>
                    </div>

                    <div className="p-5 border-b border-[#171717] space-y-2 text-xs">
                        <div className="flex gap-2">
                            <span className="text-[#737373] w-16">To:</span>
                            <span className="text-[#FAFAFA] font-mono">recruitment@innovatetech.com</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[#737373] w-16">Subject:</span>
                            <span className="text-[#FAFAFA] font-medium">
                                {comparisonTab === "ai"
                                    ? "Application: Software Engineer Intern (Backend) - Alex Chen"
                                    : "Internship application / CV attached"}
                            </span>
                        </div>
                        {comparisonTab === "ai" && (
                            <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                                <span className="text-[#737373] w-16">Files:</span>
                                <span className="px-2 py-0.5 rounded bg-[#171717] text-[#D4D4D4]">
                                    Alex_Chen_CV.pdf
                                </span>
                                <span className="px-2 py-0.5 rounded bg-[#171717] text-[#D4D4D4]">
                                    Stanford_Recommendation.pdf
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 text-xs sm:text-sm text-[#D4D4D4] leading-relaxed space-y-3 font-sans">
                        {comparisonTab === "ai" ? (
                            <>
                                <p>Dear InnovateTech Engineering Team,</p>
                                <p>
                                    I am writing to apply for the Backend Engineering Internship. Having followed InnovateTech’s recent architecture scaling to high-throughput Node.js microservices and PostgreSQL, my hands-on background directly matches your stack.
                                </p>
                                <p>
                                    As a CS junior at Stanford, I built a real-time event pipeline handling 150k daily events with sub-40ms latency using Node.js, Express, TypeScript, and Neon PostgreSQL.
                                </p>
                                <p>
                                    My complete CV and endorsement letter are attached. I look forward to the opportunity to contribute to your backend team this summer.
                                </p>
                                <p className="pt-2 text-[#737373] font-mono text-xs">
                                    Best regards,<br />
                                    Alex Chen • github.com/alexchen-dev
                                </p>
                            </>
                        ) : (
                            <>
                                <p>Dear Hiring Team,</p>
                                <p>
                                    I am looking for an internship at your company. I am very hard working and willing to learn any technology you use.
                                </p>
                                <p>
                                    Please find my resume attached in the file below. Let me know if you have any open vacancies.
                                </p>
                                <p className="text-[#737373] font-mono text-xs">Thank you,<br />Student</p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#171717]">
                <div className="text-center mb-14">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] mb-2">
                        How It Works
                    </h2>
                    <p className="text-sm text-[#737373]">
                        Three steps from profile to sent application.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            step: "01",
                            title: "Profile Setup",
                            desc: "Upload your CV and recommendation letter once. Add target roles and portfolio links."
                        },
                        {
                            step: "02",
                            title: "AI Generation",
                            desc: "Select a partner company. AI crafts an application pitch matching your projects to their stack."
                        },
                        {
                            step: "03",
                            title: "Direct Send & Track",
                            desc: "Review the draft, hit send, and track the delivered application in your dashboard."
                        }
                    ].map((item) => (
                        <div key={item.step} className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#171717]">
                            <span className="text-2xl font-black font-mono text-[#737373] block mb-4">
                                {item.step}
                            </span>
                            <h3 className="text-base font-bold text-[#FAFAFA] mb-2">{item.title}</h3>
                            <p className="text-xs text-[#737373] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#171717]">
                <div className="text-center mb-14">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] mb-2">
                        Core Platform Features
                    </h2>
                    <p className="text-sm text-[#737373]">
                        Built to streamline technical internship outreach.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#171717]">
                        <h3 className="text-base font-bold text-[#FAFAFA] mb-2">AI Context Matching</h3>
                        <p className="text-xs text-[#737373] leading-relaxed">
                            Aligns candidate achievements and coursework directly with each company&apos;s verified industry profile and engineering requirements.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#171717]">
                        <h3 className="text-base font-bold text-[#FAFAFA] mb-2">Document Vault</h3>
                        <p className="text-xs text-[#737373] leading-relaxed">
                            Securely stores CVs and endorsement letters on high-speed CDN, automatically attaching them as verified PDF files.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#171717]">
                        <h3 className="text-base font-bold text-[#FAFAFA] mb-2">In-Inbox Email Delivery</h3>
                        <p className="text-xs text-[#737373] leading-relaxed">
                            Sends authenticated emails directly from the platform with return-path routing so recruiter replies come straight to you.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#171717]">
                        <h3 className="text-base font-bold text-[#FAFAFA] mb-2">Unified Pipeline Tracker</h3>
                        <p className="text-xs text-[#737373] leading-relaxed">
                            Maintains an auditable timeline of every company contacted, full letter contents, and delivery timestamps.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion Section */}
            <section id="faq" className="py-20 px-6 max-w-3xl mx-auto border-t border-[#171717]">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] mb-2">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div
                                key={faq.q}
                                className="rounded-xl bg-[#0A0A0A] border border-[#171717] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : index)}
                                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#171717]/30 transition-colors"
                                >
                                    <span className="text-sm font-semibold text-[#FAFAFA] pr-4">
                                        {faq.q}
                                    </span>
                                    <span className="text-xs text-[#737373] font-mono">
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-4 text-xs text-[#737373] leading-relaxed border-t border-[#171717]">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Bottom CTA Banner */}
            <section className="py-16 px-6 max-w-4xl mx-auto text-center border-t border-[#171717]">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] mb-4">
                    Ready to start applying?
                </h2>
                <p className="text-sm text-[#737373] mb-8">
                    Set up your profile once and generate your first tailored application in seconds.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => signIn.social({ provider: "google" })}
                        className="px-6 py-3 bg-[#FAFAFA] text-[#000000] font-semibold rounded-xl hover:bg-[#D4D4D4] transition-colors text-sm w-full sm:w-auto"
                    >
                        Get Started with Google
                    </button>
                    <button
                        onClick={() => signIn.social({ provider: "github" })}
                        className="px-6 py-3 bg-[#0A0A0A] text-[#FAFAFA] font-medium rounded-xl border border-[#171717] hover:border-[#737373] transition-colors text-sm w-full sm:w-auto"
                    >
                        Continue with GitHub
                    </button>
                </div>
            </section>

            {/* Clean, Minimal Monochrome Footer (No Tech/Security sections) */}
            <footer className="border-t border-[#171717] bg-[#000000] py-10 px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-[#FAFAFA] text-[#000000] flex items-center justify-center font-bold text-xs">
                            IL
                        </div>
                        <span className="text-xs font-semibold text-[#FAFAFA]">InternLink</span>
                        <span className="text-xs text-[#737373]">© {new Date().getFullYear()}</span>
                    </div>

                    <nav className="flex flex-wrap items-center gap-6 text-xs text-[#737373]">
                        <a href="#how-it-works" className="hover:text-[#FAFAFA] transition-colors">How It Works</a>
                        <a href="#comparison" className="hover:text-[#FAFAFA] transition-colors">Comparison</a>
                        <a href="#features" className="hover:text-[#FAFAFA] transition-colors">Features</a>
                        <a href="#faq" className="hover:text-[#FAFAFA] transition-colors">FAQ</a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#FAFAFA] transition-colors">GitHub</a>
                    </nav>
                </div>
            </footer>
        </main>
    );
}
