"use client";
import dayjs from "dayjs";
import DayJSUtc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone";
import React, { useState } from "react";
import DeleteExpenses from "../(mutations)/(expenses)/DeleteExpenses";
import AddExpensesForm from "../(mutations)/(expenses)/AddExpenses";
import EditExpenses from "../(mutations)/(expenses)/EditExpenses";
import { AnimatePresence } from "motion/react";
import { EXPENSE_TAG_COLOR_MAP } from "@/app/(lib)/client-commons";
import { motion } from "motion/react";
// import Select from "react-select/base";
import AddIncome from "../(mutations)/(income)/AddIncome";

dayjs.extend(DayJSUtc)
dayjs.extend(timezone);

function ExpensesTabList({
    expenses,
    userId,
}: {
    expenses: LeanExpenseWithId[];
    userId: string;
}) {
    const [selectedExpense, setSelectedExpense] =
        useState<LeanExpenseWithId | null>(null);
    return (
        <AnimatePresence>
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
                const datejsDate = dayjs(date)?.tz('America/Toronto');
                return (
                    <motion.div
                        className="flex flex-col border-2"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
                                        datejsDate ? datejsDate
                                              .format("YYYY-MMM-DD") : "ERROR"}
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
                                    onClick={() => setSelectedExpense(expense)}
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
                );
            })}
        </AnimatePresence>
    );
}

function IncomeTabList({
    allIncome,
    userId,
}: {
    allIncome: LeanIncomeWithId[];
    userId: string;
}) {
    const [selectedIncome, setSelectedIncome] =
        useState<LeanIncomeWithId | null>(null);
    return (
        <AnimatePresence>
            {allIncome.map((income, index) => {
                const { name, amount, payInterval, notes, _id } = income;
                return (
                    <motion.div
                        className="flex flex-col border-2"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={name + index}
                    >
                        <div className="flex">
                            <div
                                className={`flex-grow basis-auto p-2 transition-all ${
                                    selectedIncome ? " border-b-2" : ""
                                }`}
                            >
                                <div>
                                    {name} - ${amount}{" "}
                                </div>
                                <div>{payInterval}</div>
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
                                    onClick={() => setSelectedIncome(income)}
                                >
                                    EDIT
                                </button>
                                {/* <DeleteIncome
                                    userId={userId}
                                    incomeId={_id}
                                /> */}
                            </div>
                        </div>
                        <AnimatePresence>
                            {/* {selectedIncome?._id === _id && (
                                <EditIncome
                                    income={selectedIncome}
                                    removeSelectedIncome={() => {
                                        setSelectedIncome(null);
                                    }}
                                />
                            )} */}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </AnimatePresence>
    );
}

function ExpensesList({
    expenses,
    userId,
    income,
}: {
    expenses: LeanExpenseWithId[];
    income: LeanIncomeWithId[];
    userId: string;
}) {
    const recurringExpensesTotal = expenses
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
        ?.toFixed(2);

    const nonRecurringExpenses = expenses
        .filter((expense) => !expense.subscriptionInterval)
        .reduce<number>((prev, expense) => (prev += expense.cost), 0);

    const liquidExpenses = expenses
        .filter((expense) => expense.tags?.includes("liquid"))
        .reduce<number>((prev, expense) => (prev += expense.cost), 0);

    const expensesTotal =
        Number(recurringExpensesTotal) + liquidExpenses + nonRecurringExpenses;

    const recurringIncome = income.reduce<number | null>((prev, inc) => {
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
    }, 0);

    const net = Number(recurringIncome) - expensesTotal;

    const [addExpenseState, setAddExpenseState] = useState(false);
    const [addIncomeState, setAddIncomeState] = useState(false);
    const [selectedTabList, setSelectedTabList] = useState("expenses");

    return (
        <div className="">
            <h1>Expenses Overview: </h1>
            <div>
                ${recurringExpensesTotal}/month + ${liquidExpenses} liquid
                /month + ${nonRecurringExpenses} single payments = $
                {expensesTotal} total for the month of{" "}
                {dayjs(new Date()).format("MMMM")}
            </div>
            <h1>Income Overview: </h1>
            <div>${recurringIncome}/month</div>
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
                    ${net + liquidExpenses} (max)
                </span>{" "}
                {net > 0 ? "positive" : "negative"} / month
            </div>
            <hr />
            <div className="flex gap-2 my-4">
                <button
                    type="button"
                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-2 px-4"
                    onClick={() => setAddExpenseState((prev) => !prev)}
                    disabled={addExpenseState}
                >
                    New Expense
                </button>
                <button
                    type="button"
                    className="bg-[color:--color-s-2] text-[color:--color-neutral] py-2 px-4"
                    onClick={() => setAddIncomeState((prev) => !prev)}
                    disabled={addIncomeState}
                >
                    New Income
                </button>
            </div>
            <hr />
            <AnimatePresence>
                {addExpenseState && (
                    <motion.div
                        key="add-expense-form-container"
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
                {addIncomeState && (
                    <motion.div
                        key="add-income-form-container"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AddIncome
                            userId={userId}
                            toggleShowState={() =>
                                setAddIncomeState((prev) => !prev)
                            }
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <hr />
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setSelectedTabList("expenses")}
                >
                    Expenses
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedTabList("income")}
                >
                    Income
                </button>
            </div>
            {selectedTabList === "expenses" && (
                <ExpensesTabList expenses={expenses} userId={userId} />
            )}
            {selectedTabList === "income" && (
                <IncomeTabList allIncome={income} userId={userId} />
            )}
        </div>
    );
}

export default ExpensesList;
