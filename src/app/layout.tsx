import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./(components)/Sidebar";
import SessionWrapper from "./(components)/SessionWrapper";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Cat's Personal Scheduler",
    description: "Get your shit working",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex relative`}
            >
                <SessionWrapper>
                    <Sidebar />
                    {children}
                    <ToastContainer position="bottom-right" closeOnClick />
                </SessionWrapper>
            </body>
        </html>
    );
}
