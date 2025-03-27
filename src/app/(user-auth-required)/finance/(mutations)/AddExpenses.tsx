"use client";
import { EXPENSE_TAGS, SUBSCRIPTION_INTERVAL } from "@/app/(db)/common";
import { addExpense } from "@/app/actions";
import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
// import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";

const initialState = {
    message: null as null | string,
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            className="p-2 bg-[color:--color-s-2] text-[color:--color-neutral]"
            type="submit"
            aria-disabled={pending}
        >
            Add Expense
        </button>
    );
};

function AddExpensesForm({ userId }: { userId: string }) {
    const [state, addExpenseAction] = useActionState(addExpense, initialState);

    // const [selectedExpenseTags, setSelectedExpenseTags] = useState<
    //     (typeof EXPENSE_TAGS)[number][]
    // >([]);

    // const modifyFormData = (
    //     action: "add" | "remove",
    //     tag: (typeof EXPENSE_TAGS)[number]
    // ) => {
    //     if (action === "add") {
    //         setSelectedExpenseTags((prev) => [...prev, tag]);
    //     } else if (action === "remove") {
    //         setSelectedExpenseTags((prev) =>
    //             prev.filter((currTag) => currTag !== tag)
    //         );
    //     } else {
    //         throw new Error("Add Expense Form Tag Error");
    //     }
    // };

    // TODO: test tags on actions.tsx

    // useEffect(() => {
    //     // not the best solution but it will work fine at this tiny scale
    //     const form = document.getElementById(
    //         "add-expense-form"
    //     ) as HTMLFormElement;
    //     const formData = new FormData(form);
    //     formData.delete("tags");

    //     formData.append("tags", JSON.stringify(selectedExpenseTags));

    //     console.log("formData");
    //     console.log(formData.getAll("tags"));
    // }, [selectedExpenseTags]);

    useEffect(() => {
        const { message } = state;
        if (message?.includes("Success")) toast.success(message);
        if (message?.includes("Error")) toast.error(message);
    }, [state]);

    return (
        <form
            action={addExpenseAction}
            id="add-expense-form"
            className="max-w-60 [&_input]:text-[color:--color-p-2]"
        >
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
                    defaultValue={new Date().toISOString().split("T")[0]}
                    max={new Date().toISOString().split("T")[0]}
                />
            </div>
            <div className="flex flex-col">
                <span className="capitalize">subscription interval:</span>
                <div className="flex flex-wrap">
                    <div
                        className="flex-shrink-0 basis-3/6 mx-auto"
                    >
                        <input
                            name="subscription-interval"
                            id={`subscription-interval-unset`}
                            placeholder="Enter subscription-interval value"
                            type="radio"
                            defaultValue="unset"
                            className="mr-1"
                        />
                        <label htmlFor={`subscription-interval-unset`}>
                            unset
                        </label>
                    </div>
                    {[...SUBSCRIPTION_INTERVAL.values()].map((val, index) => (
                        <div
                            className="flex-shrink-0 basis-3/6 mx-auto"
                            key={`subscriptionInterval-${index}`}
                        >
                            <input
                                name="subscription-interval"
                                id={`subscription-interval-${val}`}
                                placeholder="Enter subscription-interval value"
                                type="radio"
                                defaultValue={val}
                                className="mr-1"
                            />
                            <label htmlFor={`subscription-interval-${val}`}>
                                {val}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="flex flex-col">
                <span className="capitalize">tags:</span>
                <div className="flex flex-wrap">
                    {selectedExpenseTags.map((tag, index) => (
                        <span
                            key={tag + index + "selected"}
                            className="capitalize"
                        >
                            {tag}{" "}
                            <button
                                className="ml-1 bg-gray-500 text-white"
                                type="button"
                                onClick={() => modifyFormData("remove", tag)}
                            >
                                <FaXmark />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex flex-wrap">
                    {[...EXPENSE_TAGS.values()]
                        .filter((tag) => !selectedExpenseTags.includes(tag))
                        .map((tag, index) => (
                            <button
                                className="flex-shrink-0 basis-3/6 mx-auto"
                                key={`${tag}-${index}`}
                                type="button"
                                onClick={() => modifyFormData("add", tag)}
                            >
                                {tag}
                            </button>
                        ))}
                </div>
            </div> */}
            <div>
                <span className="capitalize">Tag:</span>
                <div className="flex flex-wrap">
                    {[...EXPENSE_TAGS.values()].map((val, index) => (
                        <div
                            className="flex-shrink-0 basis-3/6 mx-auto"
                            key={`val-${index}`}
                        >
                            <input
                                name="tag"
                                id={`tag-${val}`}
                                placeholder="Enter tag value"
                                type="radio"
                                defaultValue={val}
                                className="mr-1"
                            />
                            <label htmlFor={`tag-${val}`}>{val}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col">
                <label htmlFor="notes" className="capitalize">
                    notes:
                </label>
                <textarea
                    name="notes"
                    id="notes"
                    placeholder="Enter notes"
                    className=""
                />
            </div>
            <div>
                <SubmitButton />
            </div>
        </form>
    );
}

export default AddExpensesForm;
