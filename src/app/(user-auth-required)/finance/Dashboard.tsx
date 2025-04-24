import { getBudget, getExpenses, getIncome } from "@/app/actions";
import { Session } from "next-auth";
import React from "react";
import ExpensesList from "./(graphs)/ExpensesList";
import { NODE_ENV } from "@/app/(config)/constants";
import Graphs from "./(graphs)/Graphs";
// import Util from "util";

async function Dashboard({ session }: { session: Session }) {
    const [expensesStringified, incomeStringified, budgetsStringified] =
        await Promise.all([
            getExpenses({ userId: session.user.id }),
            getIncome({ userId: session.user.id }),
            getBudget({ userId: session.user.id }),
        ]);
    const expenses = JSON.parse(expensesStringified) as LeanExpenseWithId[];
    const income = JSON.parse(incomeStringified) as LeanIncomeWithId[];
    const budgets = JSON.parse(budgetsStringified) as LeanBudgetWithId[];
    // console.log("Dashboard - expenses");
    // console.log(Util.inspect(expenses, false, null, true));

    return (
        <main className="overflow-auto flex-1">
            <div className="w-9/12 mx-auto relative">
                <h1>
                    userId: {session.user.id}{" "}
                    {NODE_ENV !== "prod" ? " - DEV MODE" : ""}
                </h1>

                <Graphs budgets={budgets} expenses={expenses} income={income} />
                <ExpensesList
                    income={income}
                    expenses={expenses.sort((_, __) => -1)}
                    budgets={budgets}
                    userId={session.user.id}
                />
            </div>
        </main>
    );
}

export default Dashboard;
