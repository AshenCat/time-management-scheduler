import React from "react";
import { auth, signIn } from "@/../auth";
import Dashboard from "./Dashboard";

async function page() {
    const session = await auth();

    if (!session) return <div>Seems like you are not logged in</div>;

    return (
        <div>
            <Dashboard />
        </div>
    );
}

export default page;
