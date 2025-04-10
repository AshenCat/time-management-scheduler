import { getExpenses, getIncome } from "@/app/actions";
import { Session } from "next-auth";
import React from "react";
import ExpensesList from "./(graphs)/ExpensesList";
// import Util from "util";

async function Dashboard({ session }: { session: Session }) {
    const [expensesStringified, incomeStringified] = await Promise.all([
        getExpenses({ userId: session.user.id }),
        getIncome({ userId: session.user.id }),
    ]);
    const expenses = JSON.parse(expensesStringified) as LeanExpenseWithId[];
    const income = JSON.parse(incomeStringified) as LeanIncomeWithId[];
    // console.log("Dashboard - expenses");
    // console.log(Util.inspect(expenses, false, null, true));

    return (
        <main className="overflow-auto flex-1">
            <div className="w-9/12 mx-auto relative">
                <h1>userId: {session.user.id} - DEV MODE</h1>
                <ExpensesList
                    income={income}
                    expenses={expenses.sort((_, __) => -1)}
                    userId={session.user.id}
                />
            </div>
        </main>
    );
}

export default Dashboard;
