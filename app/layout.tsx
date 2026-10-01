import type { Metadata } from "next";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Home Finder | Find a home and a neighborhood you'll love",
  description:
    "Explore homes with neighborhood scores that help you compare the places around each address.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
