"use client";
import React, { useState } from "react";
import DeleteIncome from "./DeleteIncome";
import Pagination from "@/app/(components)/(ListComponents)/Pagination";
import IncomeListFilters from "./IncomeListFilters";

export default function IncomeList({
    income,
    totalPages,
    totalCount,
}: {
    income: LeanIncomeWithId[];
    totalPages: number;
    totalCount: number;
}) {
    const [selectedIncome, setSelectedIncome] =
        useState<LeanIncomeWithId | null>(null);
    return (
        <div className="flex flex-col gap-2">
            <IncomeListFilters />
            <div className="flex flex-col">
                {income.map((incomeItem) => {
                    const { name, amount, payInterval, notes, _id } =
                        incomeItem;
                    return (
                        <div className="flex flex-col border-2" key={_id}>
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
                                        onClick={() =>
                                            setSelectedIncome(incomeItem)
                                        }
                                    >
                                        EDIT
                                    </button>
                                    <DeleteIncome
                                        incomeId={_id}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Pagination
                URL="/finance/income?"
                totalCount={totalCount}
                totalPages={totalPages}
            />
        </div>
    );
}
