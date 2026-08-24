import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visitor Atlas | Bookchaowalit",
  description: "A simulated visitor map demo with fixed city markers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
