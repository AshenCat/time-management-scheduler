"use client";
import dayjs from "dayjs";
import DayJSUtc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React, { useState } from "react";
import DeleteExpenses from "../expenses/DeleteExpenses";
// import AddExpensesForm from "../expenses/add-new/AddExpenses";
// import EditExpenses from "../expenses/EditExpenses";
import { AnimatePresence } from "motion/react";
import { EXPENSE_TAG_COLOR_MAP } from "@/app/(lib)/client-commons";
import { motion } from "motion/react";
// import Select from "react-select/base";

dayjs.extend(DayJSUtc);
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
                const datejsDate = dayjs(date)?.tz("America/Toronto");
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
                                          (datejsDate
                                              ? datejsDate.format("YYYY-MMM-DD")
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
                        {/* <AnimatePresence>
                            {selectedExpense?._id === _id && (
                                <EditExpenses
                                    expense={selectedExpense}
                                    removeSelectedExpense={() => {
                                        setSelectedExpense(null);
                                    }}
                                />
                            )}
                        </AnimatePresence> */}
                    </motion.div>
                );
            })}
        </AnimatePresence>
    );
}

function IncomeTabList({
    allIncome,
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
    budgets: LeanBudgetWithId[];
    userId: string;
}) {
    const [selectedTabList, setSelectedTabList] = useState("expenses");

    return (
        <div className="">
            <div className="flex gap-2 my-4">
                
                
            </div>
            <hr />
            <AnimatePresence mode="popLayout">
                {/* {addExpenseState && (
                    <motion.div
                        key="add-expense-form-container"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                                delay: 0.2,
                                type: "spring",
                                visualDuration: 0.3,
                                bounce: 0.4,
                            },
                        }}
                    >
                        <AddExpensesForm
                            userId={userId}
                            toggleShowState={() => toggleStates("")}
                        />
                    </motion.div>
                )} */}
                {/* {addIncomeState && (
                    <motion.div
                        key="add-income-form-container"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                                delay: 0.2,
                                type: "spring",
                                visualDuration: 0.3,
                                bounce: 0.4,
                            },
                        }}
                    >
                        <AddIncome
                            userId={userId}
                            toggleShowState={() => toggleStates("")}
                        />
                    </motion.div>
                )} */}
                {/* {addBudgetState && (
                    <motion.div
                        key="add-budget-form-container"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                                delay: 0.2,
                                type: "spring",
                                visualDuration: 0.3,
                                bounce: 0.4,
                            },
                        }}
                    >
                        <AddBudget
                            userId={userId}
                            toggleShowState={() => toggleStates("")}
                        />
                    </motion.div>
                )} */}
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
