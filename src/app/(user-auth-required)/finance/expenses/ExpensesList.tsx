"use client";
import React, { useEffect, useState } from "react";
import DeleteExpenses from "./DeleteExpenses";
import dayjs from "dayjs";
import DayJSUtc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { EXPENSE_TAG_COLOR_MAP } from "@/app/(lib)/client-commons";
import EditExpenses from "./EditExpenses";
import ExpensesListFilters from "./ExpensesListFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import { useDebounce } from "@/app/(components)/(reusable)/hooks/useDebounce";
import { useIsMount } from "@/app/(components)/(reusable)/hooks/useIsMount";

dayjs.extend(DayJSUtc);
dayjs.extend(timezone);

const Pagination = ({
    totalPages,
    totalCount,
}: {
    totalPages: number;
    totalCount: number;
}) => {
    const searchParams = useSearchParams();
    const skip = Number(searchParams.get("skip"))
        ? Number(searchParams.get("skip"))
        : 0;
    const limit = Number(searchParams.get("limit"))
        ? Number(searchParams.get("limit"))
        : 5;

    const isMount = useIsMount();
    const router = useRouter();
    const [debouncedPage, setDebouncedPage] = useDebounce<number>(skip ?? 0);

    useEffect(() => {
        console.log("debouncedPage", debouncedPage);
        if (!isMount) {
            const nextSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            if (debouncedPage - 1 > 0) {
                nextSearchParams.set("skip", "" + (debouncedPage - 1));
                router.replace(
                    "/finance/expenses?" + nextSearchParams.toString()
                );
            } else {
                nextSearchParams.delete("skip");
                router.replace(
                    "/finance/expenses?" + nextSearchParams.toString()
                );
            }
        }
    }, [isMount, debouncedPage]);

    const pageItemsCountStart = limit * skip + 1;
    const pageItemsCountEnd = limit * skip + limit;

    return (
        <div className="flex flex-col">
            <div>
                {`${
                    totalCount <= pageItemsCountStart
                        ? totalCount
                        : pageItemsCountStart
                } - ${
                    totalCount <= pageItemsCountEnd
                        ? totalCount
                        : pageItemsCountEnd
                }`}{" "}
                of {totalCount} items
            </div>
            <div className="flex gap-4">
                <button
                    className="flex items-center disabled:cursor-not-allowed"
                    disabled={(skip ?? 0) === 0}
                    value={skip}
                    onClick={() => setDebouncedPage(skip)}
                >
                    <FaCaretLeft /> <span>Prev</span>
                </button>
                <span>
                    <input
                        type="number"
                        defaultValue={skip + 1}
                        min={1}
                        onChange={(e) =>
                            setDebouncedPage(Number(e.target.value))
                        }
                        className="w-12 p-2 text-black"
                    />
                    <span> of {totalPages} pages</span>
                </span>
                <button
                    className="flex items-center disabled:cursor-not-allowed"
                    disabled={totalCount <= pageItemsCountEnd}
                    onClick={() => setDebouncedPage(skip + 2)}
                >
                    <span>Next</span>
                    <FaCaretRight />
                </button>
            </div>
        </div>
    );
};

function ExpensesList({
    expenses,
    userId,
    budgets,
    totalPages,
    totalCount,
}: {
    expenses: LeanExpenseWithId[];
    budgets: LeanBudgetWithId[];
    userId: string;
    totalPages: number;
    totalCount: number;
}) {
    const [selectedExpense, setSelectedExpense] =
        useState<LeanExpenseWithId | null>(null);

    return (
        <div>
            <ExpensesListFilters />
            <div className="flex flex-col">
                {expenses.map((expense, index) => {
                    const {
                        name,
                        cost,
                        subscriptionInterval,
                        date,
                        tags,
                        notes,
                        _id,
                    } = expense;
                    // console.log("expense date");
                    // console.log(typeof dayjs(date));
                    // console.log(date);
                    const datejsDate = dayjs(date)?.tz("America/Toronto");
                    return (
                        <div
                            className="flex flex-col border-2"
                            key={name + index}
                        >
                            <div className="flex">
                                <div
                                    className={`flex-grow basis-auto p-2 transition-all ${
                                        selectedExpense ? " border-b-2" : ""
                                    }`}
                                >
                                    <div>
                                        {name} - ${cost}{" "}
                                    </div>
                                    <div>
                                        {subscriptionInterval
                                            ? "" + subscriptionInterval
                                            : "(One-time) - " +
                                              (datejsDate
                                                  ? datejsDate.format(
                                                        "YYYY-MMM-DD"
                                                    )
                                                  : "ERROR")}
                                    </div>
                                    <div className="flex gap-2">
                                        {tags &&
                                            tags.map((tag, index) => (
                                                <div
                                                    key={
                                                        "" +
                                                        name +
                                                        _id +
                                                        tag +
                                                        index
                                                    }
                                                    className={`capitalize rounded-sm px-2`}
                                                    style={{
                                                        backgroundColor:
                                                            EXPENSE_TAG_COLOR_MAP.get(
                                                                tag
                                                            ),
                                                    }}
                                                >
                                                    <span className="drop-shadow-lg">
                                                        {tag}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                    {notes && notes.trim() !== "" && (
                                        <div className="mt-2">
                                            <div className="bg-white rounded-sm text-black p-2">
                                                {notes}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col transition-all overflow-hidden basis-4 min-w-4 hover:basis-auto hover:min-w-[unset]">
                                    <button
                                        className="flex-1 px-4 transition-all bg-green-400 hover:bg-green-600"
                                        onClick={() =>
                                            setSelectedExpense(expense)
                                        }
                                    >
                                        EDIT
                                    </button>
                                    <DeleteExpenses
                                        userId={userId}
                                        expenseId={_id}
                                    />
                                </div>
                            </div>
                            {selectedExpense?._id === _id && (
                                <EditExpenses
                                    budgets={budgets}
                                    expense={selectedExpense}
                                    removeSelectedExpense={() => {
                                        setSelectedExpense(null);
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <Pagination totalCount={totalCount} totalPages={totalPages} />
        </div>
    );
}

export default ExpensesList;
