import React from "react";
import { auth } from "@/../auth";
import AddBudget from "./AddBudget";

async function page() {
    const session = await auth();

    if (!session) return <div>Seems like you are not logged in</div>;

    return (
        <div>
            <AddBudget userId={session.user.id} />
        </div>
    );
}

export default page;
