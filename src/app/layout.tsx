import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
// Development components (commented out for production)
// import { DevAuthPanel } from "@/components/dev/dev-auth-panel";
// import { DevStatusBar } from "@/components/dev/dev-status-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Certify | PMP Exam Prep",
  description: "The smartest way to prepare for and pass your PMP exam with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn("min-h-screen bg-white font-sans text-foreground antialiased", inter.variable)}>
        {/* <DevStatusBar /> */}
        {children}
        {/* <DevAuthPanel /> */}
      </body>
    </html>
  );
}
