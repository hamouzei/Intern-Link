import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter as requested
import { Toaster } from "sonner"; // For the toast notifications requested
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InternLink | Launch Your Next Opportunity",
  description: "Find and apply to the best tech internships smoothly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen selection:bg-primary/20`}>
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}

