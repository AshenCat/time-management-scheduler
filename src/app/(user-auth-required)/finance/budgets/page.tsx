import React from "react";
import { auth } from "@/../auth";
import { getBudget } from "@/app/actions";
import { NODE_ENV } from "@/app/(config)/constants";
import Link from "next/link";
import BudgetList from "./BudgetList";

async function page() {
    const session = await auth();

    if (!session) return <div>Seems like you are not logged in</div>;
    const budgetStringified = await getBudget({ userId: session.user.id });
    const budget = JSON.parse(budgetStringified) as LeanIncomeWithId[];

    return (
        <main className="overflow-auto flex-1">
            <div className="w-9/12 mx-auto relative">
                <h1>
                    userId: {session.user.id}{" "}
                    {NODE_ENV !== "prod" ? " - DEV MODE" : ""}
                </h1>
                <div className="flex flex-col md:flex-row gap-2 mb-2">
                    <Link
                        href="/finance"
                        className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                    >
                        Back to Overview
                    </Link>
                    <Link
                        href="/finance/expenses"
                        className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                    >
                        Expenses List
                    </Link>
                    <Link
                        href="/finance/budgets"
                        className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                    >
                        Budget List
                    </Link>
                </div>
                <div className="mb-2">
                    <Link
                        href="/finance/expenses/add-new"
                        className="bg-[color:--color-s-2] text-[color:--color-neutral] py-1 px-2"
                    >
                        Add New Income
                    </Link>
                </div>
                <BudgetList budget={budget} userId={session.user.id} />
            </div>
        </main>
    );
}

export default page;
