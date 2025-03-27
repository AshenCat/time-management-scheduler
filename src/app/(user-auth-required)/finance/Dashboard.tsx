import { getExpenses } from "@/app/actions";
import { Session } from "next-auth";
import React from "react";
import AddExpensesForm from "./(mutations)/AddExpenses";
import ExpensesList from "./(graphs)/ExpensesList";

async function Dashboard({ session }: { session: Session }) {
    const expenses = await getExpenses(session.user.id);
    console.log("Dashboard - expenses");
    console.log(expenses);

    return (
        <main className="w-9/12 mx-auto">
            <ExpensesList expenses={expenses} />
            <hr />
            <AddExpensesForm userId={session.user.id} />
        </main>
    );
}

export default Dashboard;
