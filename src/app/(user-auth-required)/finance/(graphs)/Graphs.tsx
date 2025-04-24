import { PieChart } from "@/app/(components)/(reusable)/PieChart/PieChart";
// import { transformInterval } from "@/app/(lib)/data-commons";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

interface IGraphs {
    expenses: LeanExpenseWithId[];
    budgets: LeanBudgetWithId[];
    income: LeanIncomeWithId[];
}

type MappedBudget = {
    name: string;
    maxAmount: number;
    allocatedAmount: number;
};

function Graphs({ expenses, budgets, income }: IGraphs) {
    const recurringExpensesTotal = Number(
        expenses
            .filter((expense) => expense.subscriptionInterval)
            .reduce<number | null>((prev, expense) => {
                if (prev !== 0 && !prev) return null;
                if (expense.tags?.includes("liquid")) return prev;
                if (expense.subscriptionInterval === "weekly") {
                    return (prev += expense.cost * 4);
                }
                if (expense.subscriptionInterval === "bi-weekly") {
                    return (prev += expense.cost * 2);
                }
                if (expense.subscriptionInterval === "monthly") {
                    return (prev += expense.cost);
                }
                if (expense.subscriptionInterval === "quarterly") {
                    return (prev += expense.cost / 3);
                }
                if (expense.subscriptionInterval === "bi-yearly") {
                    return (prev += expense.cost / 6);
                }
                if (expense.subscriptionInterval === "yearly") {
                    return (prev += expense.cost / 12);
                }
                return null;
            }, 0)
            ?.toFixed(2)
    );

    const recurringIncome = Number(
        income
            .reduce<number | null>((prev, inc) => {
                if (prev !== 0 && !prev) return null;
                if (inc.payInterval === "weekly") {
                    return (prev += inc.amount * 4);
                }
                if (inc.payInterval === "bi-weekly") {
                    return (prev += inc.amount * 2);
                }
                if (inc.payInterval === "monthly") {
                    return (prev += inc.amount);
                }
                if (inc.payInterval === "quarterly") {
                    return (prev += inc.amount / 3);
                }
                if (inc.payInterval === "bi-yearly") {
                    return (prev += inc.amount / 6);
                }
                if (inc.payInterval === "yearly") {
                    return (prev += inc.amount / 12);
                }
                return null;
            }, 0)
            ?.toFixed(2)
    );

    const budgetDict = new Map<string, MappedBudget>();

    for (const budget of budgets) {
        budgetDict.set(budget._id, {
            name: budget.name,
            maxAmount: budget.amount,
            allocatedAmount: 0,
        });
    }

    for (const expense of expenses) {
        if (expense.allocation) {
            // check if expense allocation is a valid budget id
            const thisBudget = budgets.find(
                (b) => b._id === expense.allocation
            );
            if (!thisBudget) {
                console.error(
                    `Budget Dict: Budget id ${expense.allocation} of expense ${expense._id} is not found`
                );
                continue;
            }
            // find previous budget value to accumulate the allocated amount
            const prev = budgetDict.get(expense.allocation);
            budgetDict.set(expense.allocation, {
                name: thisBudget.name,
                maxAmount: thisBudget.amount,
                allocatedAmount: (prev?.allocatedAmount ?? 0) + expense.cost,
            });
        }
    }

    console.log("budgetDict", budgetDict);

    const budgetMaxAmountTotal = budgets.reduce(
        (prev, budget) => prev + budget.amount,
        0
    );

    const budgetAllocatedAmountTotal = Array.from(budgetDict.values()).reduce(
        (prev, b) => prev + b.allocatedAmount,
        0
    );

    const allocatedExpenses = Array.from(budgetDict.values()).reduce(
        (prev, v) => v.allocatedAmount + prev,
        0
    );

    const expensesTotal = recurringExpensesTotal + allocatedExpenses;

    const net = Number(recurringIncome) - expensesTotal - budgetMaxAmountTotal;

    return (
        <div>
            <div className="py-4">
                <div className="flex flex-col-reverse lg:flex-row gap-4">
                    <div className="flex-1">
                        {/* INCOME */}
                        <div>
                            <h1>Income Overview: </h1>
                            <div>${recurringIncome} total income</div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Link
                                    href="/finance/income"
                                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                                >
                                    List Income
                                </Link>
                                <Link
                                    href="/finance/income/add"
                                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                                >
                                    Add New Income
                                </Link>
                            </div>
                        </div>
                        {/* Expenses */}
                        <div className="mt-2">
                            <h1>Expenses Overview: </h1>
                            <div>
                                ${recurringExpensesTotal}/month + $
                                {allocatedExpenses} liquid /month = $
                                {expensesTotal} total for the month of{" "}
                                {dayjs(new Date()).format("MMMM")}
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Link
                                    href="/finance/expenses"
                                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                                >
                                    List Expenses
                                </Link>
                                <Link
                                    href="/finance/expenses/add"
                                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                                >
                                    Add New Expenses
                                </Link>
                            </div>
                        </div>
                        {/* Budget */}
                        <div className="mt-2">
                            <h1>Budgets Overview:</h1>
                            <div>Spent: ${budgetAllocatedAmountTotal}</div>
                            <div>
                                Remaining: $
                                {budgetMaxAmountTotal -
                                    budgetAllocatedAmountTotal}
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Link
                                    href="/finance/budgets"
                                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                                >
                                    List Budget
                                </Link>
                                <Link
                                    href="/finance/budgets/add"
                                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                                >
                                    Add New Budget
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="h-96 p-2 flex-1 bg-white rounded-sm shadow-md">
                        {/* using name as id for chart for labelling purposes */}
                        <PieChart
                            data={[
                                {
                                    id: "Expenses",
                                    label: `Expenses`,
                                    value: recurringExpensesTotal,
                                },
                                // Budget here
                                {
                                    id: "Spent Budget",
                                    label: "Spent Budget",
                                    value: budgetAllocatedAmountTotal,
                                },
                                {
                                    id: "Unspent Budget",
                                    label: "Unspent Budget",
                                    value:
                                        budgetMaxAmountTotal -
                                        budgetAllocatedAmountTotal,
                                },
                                {
                                    id: "Take home",
                                    label: `Take home`,
                                    value: Number(
                                        (
                                            recurringIncome -
                                            recurringExpensesTotal -
                                            budgetMaxAmountTotal
                                        ).toFixed(2)
                                    ),
                                },
                            ]}
                            centerText={true}
                        />
                    </div>
                </div>
            </div>
            <div>
                <h1>Budgets</h1>
                <div className="flex justify-center wrap">
                    {Array.from(budgetDict.entries()).map(([id, budget]) => (
                        <div key={id} className="flex flex-col basis-64">
                            <div className="text-center">{budget.name}</div>
                            <div className="h-64 w-full">
                                <PieChart
                                    data={[
                                        {
                                            id: "Allocated",
                                            label: "Allocated",
                                            value: budget.allocatedAmount,
                                        },
                                        {
                                            id: "Unallocated",
                                            label: "Unallocated",
                                            value:
                                                budget.maxAmount -
                                                budget.allocatedAmount,
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-2 bg-white text-black">
                You are{" "}
                <span
                    className={`underline ${
                        net > 0 ? "text-green-400" : "text-red-400"
                    }`}
                >
                    ${net.toFixed(2)} (min)
                </span>{" "}
                or{" "}
                <span
                    className={`underline ${
                        net > 0 ? "text-green-400" : "text-red-400"
                    }`}
                >
                    ${(net + allocatedExpenses).toFixed(2)} (max)
                </span>{" "}
                {net > 0 ? "positive" : "negative"} / month
            </div>
            <div>
                <span className="italic text-xs">
                    note: interval values are transformed to monthly
                </span>
            </div>
            {/* <div>${recurringIncome}/month</div> */}

            {/* <button
                type="button"
                className="bg-[color:--color-s-2] text-[color:--color-neutral] py-2 px-4"
                // onClick={() => toggleStates("expense")}
                // disabled={addExpenseState}
            >
                New Expense
            </button> */}
        </div>
    );
}

export default Graphs;
