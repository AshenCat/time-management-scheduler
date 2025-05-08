import React from "react";
import { auth } from "@/../auth";
import { getIncome } from "@/app/actions";
import { NODE_ENV } from "@/app/(config)/constants";
import Link from "next/link";
import IncomeList from "./IncomeList";

async function page({
    // params,
    searchParams,
}: {
    // params: Promise<{ muscleGroup: string }>;
    searchParams: Promise<{
        searchKeyword: string;
        sort: string;
        deleted: string;
        skip: string;
        limit: string;
    }>;
}) {
    const session = await auth();

    const searchParamsVal = await searchParams;

    if (!session) return <div>Seems like you are not logged in</div>;
    const incomeStringified = await getIncome({
        searchKeyword: searchParamsVal.searchKeyword,
        sort: searchParamsVal.sort,
        deleted: ["only", "include"].includes(searchParamsVal.deleted)
            ? (searchParamsVal.deleted as "only" | "include")
            : undefined,
        skip: Number.isInteger(Number(searchParamsVal.skip))
            ? Number(searchParamsVal.skip)
            : 0,
        limit: Number.isInteger(Number(searchParamsVal.limit))
            ? Number(searchParamsVal.limit)
            : 5,
    });
    const income = JSON.parse(incomeStringified.income) as LeanIncomeWithId[];
    const totalIncomePages = incomeStringified.totalPages;
    const totalIncomeCount = incomeStringified.totalItems;
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
                        className="bg-(--color-s-2) text-(--color-neutral) py-1 px-2"
                    >
                        Back to Overview
                    </Link>
                    <Link
                        href="/finance/expenses"
                        className="bg-(--color-s-2) text-(--color-neutral) py-1 px-2"
                    >
                        Expenses List
                    </Link>
                    <Link
                        href="/finance/budgets"
                        className="bg-(--color-s-2) text-(--color-neutral) py-1 px-2"
                    >
                        Budget List
                    </Link>
                </div>
                <div className="mb-2">
                    <Link
                        href="/finance/income/add-new"
                        className="bg-(--color-s-2) text-(--color-neutral) py-1 px-2"
                    >
                        Add New Income
                    </Link>
                </div>
                <IncomeList
                    income={income}
                    totalPages={totalIncomePages}
                    totalCount={totalIncomeCount}
                />
            </div>
        </main>
    );
}

export default page;
