import React from "react";
import AddExpensesForm from "./AddExpenses";
import { auth } from "@/../auth";
import { getBudget } from "@/app/actions";

async function page() {
    const session = await auth();

    if (!session) return <div>Seems like you are not logged in</div>;
    const budgetStringified = await getBudget({ userId: session.user.id });
    const budgets = JSON.parse(budgetStringified) as LeanBudgetWithId[];
    return (
        <div>
            <AddExpensesForm userId={session.user.id} budgets={budgets} />
        </div>
    );
}

export default page;
