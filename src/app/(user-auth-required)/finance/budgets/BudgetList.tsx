'use client'
import React, { useState } from 'react'


export default function BudgetList({
    budget,
}: {
    budget: LeanBudgetWithId[];
    userId: string;
}) {
    const [selectedBudget, setSelectedBudget] =
        useState<LeanBudgetWithId | null>(null);
    return (
        <>
            {budget.map((budgetItem, index) => {
                const { name, amount, interval, notes, _id } = budgetItem;
                return (
                    <div
                        className="flex flex-col border-2"
                        key={name + index}
                    >
                        <div className="flex">
                            <div
                                className={`flex-grow basis-auto p-2 transition-all ${
                                    selectedBudget ? " border-b-2" : ""
                                }`}
                            >
                                <div>
                                    {name} - ${amount}{" "}
                                </div>
                                <div>{interval}</div>
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
                                    onClick={() => setSelectedBudget(budgetItem)}
                                >
                                    EDIT
                                </button>
                                {/* <DeleteBudget
                                    userId={userId}
                                    budgetId={_id}
                                /> */}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}