import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./(components)/Sidebar";
import SessionWrapper from "./(components)/SessionWrapper";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import DayJSUtc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone";

dayjs.extend(DayJSUtc)
dayjs.extend(timezone);


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
                    <ToastContainer 
                    position="bottom-right"
                    theme="dark"
                    pauseOnHover={true}
                    autoClose={5000}
                    closeOnClick />
                </SessionWrapper>
            </body>
        </html>
    );
}
