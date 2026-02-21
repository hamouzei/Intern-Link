"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiRequest, apiUpload } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { UploadCloud, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "QA Engineer",
    "Product Manager",
];

export default function CompleteProfilePage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const token = (session as any)?.session?.token;

    const [form, setForm] = useState({
        fullName: "",
        university: "",
        roleApplied: "",
        githubLink: "",
        portfolioLink: "",
        bio: "",
    });
    
    useEffect(() => {
      if (session?.user) {
        setForm(f => ({ ...f, fullName: session.user.name || "" }));
      }
    }, [session]);

    const [cvFile, setCvFile] = useState<File | null>(null);
    const [letterFile, setLetterFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const cvRef = useRef<HTMLInputElement>(null);
    const letterRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (f: File | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File must be less than 5MB.");
            return;
        }
        setter(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) { toast.error("Not authenticated."); return; }
        setLoading(true);

        try {
            await apiRequest("/profile", {
                method: "PUT",
                body: JSON.stringify(form),
            }, token);

            if (cvFile) {
                const fd = new FormData();
                fd.append("cv", cvFile);
                await apiUpload("/upload/cv", fd, token);
            }

            if (letterFile) {
                const fd = new FormData();
                fd.append("supportLetter", letterFile);
                await apiUpload("/upload/support-letter", fd, token);
            }

            toast.success("Profile saved successfully!");
            setTimeout(() => router.push("/companies"), 1000);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) return null;

    // Calculate completion progress
    const requiredFieldsFilled = [form.fullName, form.university, form.roleApplied, form.bio].filter(Boolean).length;
    const optionalFieldsFilled = [form.githubLink, form.portfolioLink].filter(Boolean).length;
    const filesUploaded = [cvFile, letterFile].filter(Boolean).length;
    const totalScore = requiredFieldsFilled * 15 + optionalFieldsFilled * 5 + filesUploaded * 15;
    const progress = Math.min(100, totalScore);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Profile</h1>
                <p className="text-muted-foreground mt-2 text-lg">Complete your details to start applying to companies instantly.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Pane - User Info & Progress */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-24">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-surface shadow-lg mb-4" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-surface border-4 border-border flex items-center justify-center text-3xl font-bold text-primary mb-4">
                                    {session?.user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-foreground">{session?.user?.name}</h2>
                            <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
                            
                            <div className="w-full mt-6 pt-6 border-t border-border">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-foreground">Profile Completion</span>
                                    <span className="text-primary font-bold">{progress}%</span>
                                </div>
                                <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border">
                                    <div 
                                        className="bg-primary h-full transition-all duration-500 ease-out" 
                                        style={{ width: `${progress}%` }} 
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Pane - Form */}
                <div className="w-full lg:w-2/3">
                    <Card>
                        <CardContent className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Field label="Full Name" required>
                                        <Input
                                            value={form.fullName}
                                            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                            required
                                            placeholder="e.g. Habtamu Mengesha"
                                        />
                                    </Field>

                                    <Field label="University" required>
                                        <Input
                                            value={form.university}
                                            onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                                            required
                                            placeholder="e.g. Addis Ababa University"
                                        />
                                    </Field>
                                </div>

                                <Field label="Role Applying For" required>
                                    <select
                                        value={form.roleApplied}
                                        onChange={e => setForm(f => ({ ...f, roleApplied: e.target.value }))}
                                        required
                                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200"
                                    >
                                        <option value="" disabled className="text-muted-foreground">Select a role...</option>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </Field>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Field label="GitHub Profile (Optional)">
                                        <Input
                                            type="url"
                                            value={form.githubLink}
                                            onChange={e => setForm(f => ({ ...f, githubLink: e.target.value }))}
                                            placeholder="https://github.com/yourusername"
                                        />
                                    </Field>

                                    <Field label="Portfolio Link (Optional)">
                                        <Input
                                            type="url"
                                            value={form.portfolioLink}
                                            onChange={e => setForm(f => ({ ...f, portfolioLink: e.target.value }))}
                                            placeholder="https://your-portfolio.dev"
                                        />
                                    </Field>
                                </div>

                                <Field label="Short Bio" required>
                                    <Textarea
                                        value={form.bio}
                                        onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                        required
                                        maxLength={300}
                                        className="h-24"
                                        placeholder="Briefly describe your skills and passion for this role. (max 300 characters)"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1 text-right">{form.bio.length}/300</p>
                                </Field>

                                {/* File Uploads */}
                                <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <FileUploadZone 
                                        label="Resume / CV" 
                                        file={cvFile} 
                                        inputRef={cvRef} 
                                        onChange={e => handleFileChange(e, setCvFile)} 
                                    />
                                    <FileUploadZone 
                                        label="Supporting Letter" 
                                        file={letterFile} 
                                        inputRef={letterRef} 
                                        onChange={e => handleFileChange(e, setLetterFile)} 
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
                                        {loading ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Profile...</>
                                        ) : (
                                            "Save & Continue"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
                {label} {required && <span className="text-primary">*</span>}
            </label>
            {children}
        </div>
    );
}

interface FileUploadZoneProps {
    label: string;
    file: File | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileUploadZone({ label, file, inputRef, onChange }: FileUploadZoneProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">{label} *</label>
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={onChange}
            />
            <div 
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 h-32 ${
                    file ? "border-[#15803D]/50 bg-[#15803D]/5 hover:bg-[#15803D]/10" : "border-border bg-background hover:bg-surface/50"
                }`}
            >
                {file ? (
                    <>
                        <CheckCircle2 className="w-8 h-8 text-[#15803D] mb-2" />
                        <span className="text-sm font-medium text-foreground truncate max-w-full px-2">{file.name}</span>
                        <span className="text-xs text-muted-foreground mt-1">Click to replace</span>
                    </>
                ) : (
                    <>
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">Upload PDF</span>
                        <span className="text-xs text-muted-foreground mt-1">Max size 5MB</span>
                    </>
                )}
            </div>
        </div>
    );
}
