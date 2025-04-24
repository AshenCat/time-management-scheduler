"use client";
import { EXPENSE_TAGS, INTERVAL } from "@/app/(db)/common";
// import { formatDateWithTimezoneISOString } from "@/app/(lib)/date-commons";
import { addExpense } from "@/app/actions";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Select from "react-select";
// import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";

const initialState = {
    message: null as null | string,
    timestamp: null as null | number,
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            className="p-2 bg-[color:--color-s-2] text-[color:--color-neutral] my-2"
            type="submit"
            aria-disabled={pending}
        >
            Add Expense
        </button>
    );
};

function AddExpensesForm({ userId }: { userId: string }) {
    const [state, addExpenseAction] = useActionState(addExpense, initialState);
    const router = useRouter();

    const { message } = state;

    useEffect(() => {
        if (message?.includes("Success")) {
            toast.success(message);
        }
        if (message?.includes("Error")) toast.error(message);
    }, [message]);

    return (
        <form
            action={addExpenseAction}
            id="add-expense-form"
            className="max-w-100 [&_input]:text-[color:--color-p-2] [&_textarea]:text-[color:--color-p-2] my-4"
        >
            <h2 className="mt-1">Add Expense</h2>
            <div className="flex flex-col">
                <label htmlFor="cost" className="capitalize">
                    cost:
                </label>
                <input
                    name="cost"
                    id="cost"
                    placeholder="Enter cost value"
                    type="number"
                    className=""
                    required
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="name" className="capitalize">
                    name:
                </label>
                <input
                    name="name"
                    id="name"
                    placeholder="Enter expense name"
                    className=""
                    required
                />
            </div>
            <div className="flex flex-col">
                <input
                    name="userId"
                    id="userId"
                    defaultValue={userId}
                    className=""
                    required
                    hidden
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="date" className="capitalize">
                    date:
                </label>
                <input
                    name="date"
                    id="date"
                    placeholder="Enter date"
                    type="date"
                    className=""
                    defaultValue={dayjs(new Date()).format("YYYY-MM-DD")}
                    max={dayjs(new Date()).format("YYYY-MM-DD")}
                />
            </div>
            <div className="flex flex-col">
                <div>
                    <span className="capitalize">subscription interval:</span>
                </div>
                <div className="flex flex-wrap">
                    <Select
                        className="flex-1 text-black"
                        placeholder="Select Subscription Interval"
                        aria-label="Subscription Interval selector"
                        instanceId="add-expense-Subscription-Interval"
                        options={[
                            { value: "unset", label: "unset" },
                            ...[...INTERVAL].map((val) => ({
                                value: val,
                                label: val,
                            })),
                        ]}
                        name="subscription-interval"
                    />
                </div>
            </div>
            <div>
                <div>
                    <span className="capitalize">tags:</span>
                </div>
                <div className="flex flex-wrap">
                    <Select
                        className="flex-1 text-black"
                        options={[...EXPENSE_TAGS].map((val) => ({
                            value: val,
                            label: val,
                        }))}
                        placeholder="Select tags"
                        aria-label="tag selector"
                        instanceId="add-expense-tag"
                        name="tags"
                        isMulti
                        delimiter=","
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <div>
                    <span className="capitalize">notes:</span>
                </div>
                <textarea
                    name="notes"
                    id="notes"
                    placeholder="Enter notes"
                    className=""
                />
            </div>
            <div className="flex gap-2 mb-2">
                <SubmitButton />
                <button type="button" onClick={() => router.back()}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default AddExpensesForm;
