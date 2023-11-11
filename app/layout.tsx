import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MindustryTool",
	description: "A website about mindustry",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>{children}</body>
		</html>
	);
}
