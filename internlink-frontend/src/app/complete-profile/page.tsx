"use client";

import { useState, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiRequest, apiUpload } from "@/lib/api";

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
    const { data: session } = useSession();
    const router = useRouter();
    const token = (session as any)?.session?.token;

    const [form, setForm] = useState({
        fullName: session?.user?.name || "",
        university: "",
        roleApplied: "",
        githubLink: "",
        portfolioLink: "",
        bio: "",
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [letterFile, setLetterFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const cvRef = useRef<HTMLInputElement>(null);
    const letterRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (f: File | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File must be less than 5MB.");
            return;
        }
        setError("");
        setter(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) { setError("Not authenticated."); return; }
        setLoading(true);
        setError("");

        try {
            // 1. Update profile
            await apiRequest("/profile", {
                method: "PUT",
                body: JSON.stringify(form),
            }, token);

            // 2. Upload CV
            if (cvFile) {
                const fd = new FormData();
                fd.append("cv", cvFile);
                await apiUpload("/upload/cv", fd, token);
            }

            // 3. Upload Support Letter
            if (letterFile) {
                const fd = new FormData();
                fd.append("supportLetter", letterFile);
                await apiUpload("/upload/support-letter", fd, token);
            }

            setSuccess("Profile saved! Redirecting...");
            setTimeout(() => router.push("/companies"), 1500);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <nav className="flex items-center px-8 py-5 border-b border-white/10">
                <span className="text-xl font-bold text-[#f5c842]">InternLink</span>
            </nav>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                <p className="text-gray-400 mb-10">Fill in your details and upload your documents to start applying.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Full Name */}
                    <Field label="Full Name" required>
                        <input
                            type="text"
                            value={form.fullName}
                            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                            required
                            className="input-field"
                            placeholder="e.g. Habtamu Mengesha"
                        />
                    </Field>

                    {/* University */}
                    <Field label="University" required>
                        <input
                            type="text"
                            value={form.university}
                            onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                            required
                            className="input-field"
                            placeholder="e.g. Addis Ababa University"
                        />
                    </Field>

                    {/* Role */}
                    <Field label="Role Applying For" required>
                        <select
                            value={form.roleApplied}
                            onChange={e => setForm(f => ({ ...f, roleApplied: e.target.value }))}
                            required
                            className="input-field"
                        >
                            <option value="">Select a role...</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </Field>

                    {/* GitHub */}
                    <Field label="GitHub Profile">
                        <input
                            type="url"
                            value={form.githubLink}
                            onChange={e => setForm(f => ({ ...f, githubLink: e.target.value }))}
                            className="input-field"
                            placeholder="https://github.com/your-username"
                        />
                    </Field>

                    {/* Portfolio */}
                    <Field label="Portfolio Link (optional)">
                        <input
                            type="url"
                            value={form.portfolioLink}
                            onChange={e => setForm(f => ({ ...f, portfolioLink: e.target.value }))}
                            className="input-field"
                            placeholder="https://your-portfolio.dev"
                        />
                    </Field>

                    {/* Bio */}
                    <Field label="Short Bio" required>
                        <textarea
                            value={form.bio}
                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                            required
                            maxLength={300}
                            rows={4}
                            className="input-field resize-none"
                            placeholder="Tell companies a bit about yourself (max 300 characters)"
                        />
                        <p className="text-xs text-gray-500 mt-1">{form.bio.length}/300</p>
                    </Field>

                    {/* CV Upload */}
                    <Field label="CV (PDF, max 5MB)" required>
                        <input
                            ref={cvRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={e => handleFileChange(e, setCvFile)}
                        />
                        <button
                            type="button"
                            onClick={() => cvRef.current?.click()}
                            className="upload-btn"
                        >
                            {cvFile ? `✅ ${cvFile.name}` : "📎 Choose CV"}
                        </button>
                    </Field>

                    {/* Support Letter Upload */}
                    <Field label="Supporting Letter (PDF, max 5MB)" required>
                        <input
                            ref={letterRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={e => handleFileChange(e, setLetterFile)}
                        />
                        <button
                            type="button"
                            onClick={() => letterRef.current?.click()}
                            className="upload-btn"
                        >
                            {letterFile ? `✅ ${letterFile.name}` : "📎 Choose Supporting Letter"}
                        </button>
                    </Field>

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {success && <p className="text-green-400 text-sm">{success}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#f5c842] text-gray-900 font-bold rounded-xl hover:bg-[#e5b83a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Save Profile & Continue →"}
                    </button>
                </form>
            </main>
        </div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
                {label} {required && <span className="text-[#f5c842]">*</span>}
            </label>
            {children}
        </div>
    );
}
