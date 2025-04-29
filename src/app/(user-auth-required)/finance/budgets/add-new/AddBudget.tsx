"use client";
import { addBudget } from "@/app/actions";
import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import { INTERVAL } from "@/app/(db)/common";
import { useRouter } from "next/navigation";

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
            Add Budget
        </button>
    );
};

function AddBudget({
    userId,
}: {
    userId: string;
}) {
    const [state, addBudgetAction] = useActionState(addBudget, initialState);
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
            action={addBudgetAction}
            id="add-budget-form"
            className="max-w-100 [&_input]:text-[color:--color-p-2] [&_textarea]:text-[color:--color-p-2] my-4"
        >
            <h2 className="mt-1">Add Budget</h2>
            <div className="flex flex-col">
                <label htmlFor="amount" className="capitalize">
                    amount:
                </label>
                <input
                    name="amount"
                    id="amount"
                    placeholder="Enter amount value"
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
                    placeholder="Enter budget name"
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
                <div>
                    <span className="capitalize">interval:</span>
                </div>
                <div className="flex flex-wrap cursor-not-allowed">
                    <Select
                        className="flex-1 text-black"
                        placeholder="Select Pay Interval"
                        aria-label="Pay Interval selector"
                        instanceId="add-budget-pay-Interval"
                        options={[
                            { value: "unset", label: "unset" },
                            ...[...INTERVAL].map((val) => ({
                                value: val,
                                label: val,
                            })),
                        ]}
                        defaultValue={{value: 'monthly', label: 'monthly'}}
                        name="budget-interval"
                        isDisabled
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

export default AddBudget;
