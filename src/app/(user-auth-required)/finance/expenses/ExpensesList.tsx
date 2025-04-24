"use client";
import React, { useState } from "react";
import DeleteExpenses from "./DeleteExpenses";
import dayjs from "dayjs";
import DayJSUtc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { EXPENSE_TAG_COLOR_MAP } from "@/app/(lib)/client-commons";
import EditExpenses from "./EditExpenses";

dayjs.extend(DayJSUtc);
dayjs.extend(timezone);

function IncomeList({
    expenses,
    userId,
}: {
    expenses: LeanExpenseWithId[];
    userId: string;
}) {
    const [selectedExpense, setSelectedExpense] =
        useState<LeanExpenseWithId | null>(null);
    return (
        <div>
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
                    <div className="flex flex-col border-2" key={name + index}>
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
                        {selectedExpense?._id === _id && (
                            <EditExpenses
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
    );
}

export default IncomeList;
