"use client";
import dayjs from "dayjs";
import React, { useState } from "react";
import DeleteExpenses from "../(mutations)/DeleteExpenses";
import AddExpensesForm from "../(mutations)/AddExpenses";
import EditExpenses from "../(mutations)/EditExpenses";
import { AnimatePresence } from "motion/react";
import { EXPENSE_TAG_COLOR_MAP } from "@/app/(lib)/client-commons";
import { motion } from "motion/react";

function ExpensesList({
    expenses,
    userId,
}: {
    expenses: LeanExpenseWithId[];
    userId: string;
}) {
    const monthlyRecurringExpensesTotal = expenses
        .filter((expense) => expense.subscriptionInterval)
        .reduce<number | null>((prev, expense) => {
            if (prev !== 0 && !prev) return null;
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
        ?.toFixed(2);
    const nonRecurringExpenses = expenses
        .filter((expense) => !expense.subscriptionInterval)
        .reduce<number>((prev, expense) => (prev += expense.cost), 0);

    const [selectedExpense, setSelectedExpense] =
        useState<LeanExpenseWithId | null>(null);
    const [addExpenseState, setAddExpenseState] = useState(false);

    return (
        <div className="">
            <h1>Expenses Overview: </h1>
            <div>
                ${monthlyRecurringExpensesTotal} per month + $
                {nonRecurringExpenses} for the month of{" "}
                {dayjs(new Date()).format("MMMM")}
            </div>
            <hr />
            <div className="my-4">
                <button
                    type="button"
                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-2 px-4"
                    onClick={() => setAddExpenseState((prev) => !prev)}
                    disabled={addExpenseState}
                >
                    New Expense
                </button>
            </div>
            <hr />
            <AnimatePresence>
                {addExpenseState && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AddExpensesForm
                            userId={userId}
                            toggleShowState={() =>
                                setAddExpenseState((prev) => !prev)
                            }
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <hr />
            <div className="flex flex-col gap-2">
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
                    return (
                        <AnimatePresence key={name + index}>
                            <motion.div
                                className="flex flex-col border-2"
                                exit={{ opacity: 0 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
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
                                                  dayjs(date).format(
                                                      "YYYY-MMM-DD"
                                                  )}
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
                                <AnimatePresence>
                                    {selectedExpense?._id === _id && (
                                        <EditExpenses
                                            expense={selectedExpense}
                                            removeSelectedExpense={() => {
                                                setSelectedExpense(null);
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>
                    );
                })}
            </div>
        </div>
    );
}

export default ExpensesList;
