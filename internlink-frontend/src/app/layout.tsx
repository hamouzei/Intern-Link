import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "InternLink | AI-Powered Internship Applications",
  description: "Craft hyper-tailored internship applications, bundle verified CVs and university recommendation letters, and land offers at top tech companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${plusJakartaSans.variable} font-sans antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200`}>
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}

