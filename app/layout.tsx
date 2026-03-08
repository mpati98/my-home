import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/main/NavBar";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Next.js + Prisma + PostgreSQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-bright min-h-screen">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
