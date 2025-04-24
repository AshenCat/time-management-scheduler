import React from "react";
import AddExpensesForm from "./AddExpenses";
import { auth } from "@/../auth";

async function page() {
    const session = await auth();

    if (!session) return <div>Seems like you are not logged in</div>;
    return (
        <div>
            <AddExpensesForm
                userId={session.user.id}
            />
        </div>
    );
}

export default page;
