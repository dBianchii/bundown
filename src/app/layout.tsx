import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
import {cn} from "~/lib/utils"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(
      "min-h-screen bg-background font-sans text-foreground antialiased",
      GeistSans.variable,
    )}>
      <body>{children}</body>
    </html>
  );
}
