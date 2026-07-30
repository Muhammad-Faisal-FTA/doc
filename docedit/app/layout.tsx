import type { Metadata } from "next";
import { UserProvider } from "@/app/providers/UserProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocEdit",
  description: "A minimal collaborative document editor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
