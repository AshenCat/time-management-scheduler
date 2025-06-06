"use client";
import { INTERVAL } from "@/app/(db)/common";
import { addIncome } from "@/app/actions";
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
            className="p-2 bg-(--color-s-2) text-(--color-neutral) my-2"
            type="submit"
            aria-disabled={pending}
        >
            Add Income
        </button>
    );
};

function AddIncomeForm() {
    const [state, addIncomeAction] = useActionState(addIncome, initialState);

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
            action={addIncomeAction}
            id="add-income-form"
            className="max-w-100 [&_input]:text-(--color-p-2) [&_textarea]:text-(--color-p-2) my-4"
        >
            <h2 className="mt-1">Add Income</h2>
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
                    placeholder="Enter income name"
                    className=""
                    required
                />
            </div>
            <div className="flex flex-col">
                <div>
                    <span className="capitalize">pay interval:</span>
                </div>
                <div className="flex flex-wrap">
                    <Select
                        className="flex-1 text-black"
                        placeholder="Select Pay Interval"
                        aria-label="Pay Interval selector"
                        instanceId="add-income-pay-Interval"
                        options={[
                            { value: "unset", label: "unset" },
                            ...[...INTERVAL].map((val) => ({
                                value: val,
                                label: val,
                            })),
                        ]}
                        name="pay-interval"
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

export default AddIncomeForm;
