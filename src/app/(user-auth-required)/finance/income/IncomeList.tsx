'use client'
import React, { useState } from 'react'


export default function IncomeTabList({
    income,
}: {
    income: LeanIncomeWithId[];
    userId: string;
}) {
    const [selectedIncome, setSelectedIncome] =
        useState<LeanIncomeWithId | null>(null);
    return (
        <>
            {income.map((incomeItem, index) => {
                const { name, amount, payInterval, notes, _id } = incomeItem;
                return (
                    <div
                        className="flex flex-col border-2"
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
                                    onClick={() => setSelectedIncome(incomeItem)}
                                >
                                    EDIT
                                </button>
                                {/* <DeleteIncome
                                    userId={userId}
                                    incomeId={_id}
                                /> */}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}