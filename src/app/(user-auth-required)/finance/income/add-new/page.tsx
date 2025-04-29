import React from "react";
import { auth } from "@/../auth";
import AddIncomeForm from "./AddIncome";

async function page() {
    const session = await auth();

    if (!session) return <div>Seems like you are not logged in</div>;
    return (
        <div>
            <AddIncomeForm userId={session.user.id} />
        </div>
    );
}

export default page;
