import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Property Investment AI - Analyze & Report",
  description: "AI-powered property analysis and report generation tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="pt-16">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
