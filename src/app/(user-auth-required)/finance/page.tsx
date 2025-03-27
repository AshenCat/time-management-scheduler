import React from "react";
import { auth } from "@/../auth";
import Dashboard from "./Dashboard";

async function page() {
    const session = await auth();

    if (!session) return <div>Seems like you are not logged in</div>;

    return (
        <>
            <Dashboard session={session} />
        </>
    );
}

export default page;
