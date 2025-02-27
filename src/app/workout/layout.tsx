import type { Metadata } from "next";
import ModalHelper from "./ModalHelper";

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
        <>
            {children}
            <ModalHelper />
        </>
    );
}
