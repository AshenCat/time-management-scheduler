"use client";
import { EXPENSE_TAGS, SUBSCRIPTION_INTERVAL } from "@/app/(db)/common";
import { editExpense } from "@/app/actions";
import { AnimatePresence, motion } from "motion/react";
import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
// import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";

const initialState = {
    message: null as null | string,
    timestamp: null as number | null,
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            className="p-2 bg-[color:--color-s-2] text-[color:--color-neutral]"
            type="submit"
            aria-disabled={pending}
        >
            Edit Expense
        </button>
    );
};

function EditExpenses({
    expense,
    onCancel,
}: {
    expense: LeanExpenseWithId | null;
    onCancel: () => void;
}) {
    const [state, editExpenseAction] = useActionState(
        editExpense,
        initialState
    );

    const [showItem, setShowItem] = useState({
        subscriptionInterval: true,
        tag: false,
        notes: false,
    });

    useEffect(() => {
        const { message } = state;
        if (message?.includes("Success")) toast.success(message);
        if (message?.includes("Error")) toast.error(message);
    }, [state]);

    if (!expense) {
        return <></>;
    }

    const { cost, name, userId, subscriptionInterval, date, tags, notes, _id } =
        expense;

    console.log("expense", expense);

    return (
        <motion.form
            action={editExpenseAction}
            id="add-expense-form"
            className="p-2 max-w-100 [&_input]:text-[color:--color-p-2] [&_textarea]:text-[color:--color-p-2]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                    defaultValue={cost}
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
                    defaultValue={name}
                    className=""
                    required
                />
            </div>
            <input
                name="userId"
                id="userId"
                defaultValue={userId}
                className=""
                required
                hidden
            />
            <input
                name="expenseId"
                id="expenseId"
                defaultValue={_id}
                className=""
                required
                hidden
            />
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
                    defaultValue={
                        new Date(date ? date : new Date())
                            .toISOString()
                            .split("T")[0]
                    }
                    max={new Date().toISOString().split("T")[0]}
                    disabled={showItem.subscriptionInterval}
                />
            </div>
            <div className="flex flex-col">
                <div>
                    <button
                        className="mr-2"
                        type="button"
                        onClick={() =>
                            setShowItem((prev) => ({
                                ...prev,
                                subscriptionInterval:
                                    !prev.subscriptionInterval,
                            }))
                        }
                    >
                        {showItem.subscriptionInterval ? (
                            <FaMinus />
                        ) : (
                            <FaPlus />
                        )}
                    </button>
                    <span className="capitalize">subscription interval:</span>
                </div>
                <AnimatePresence>
                    {showItem.subscriptionInterval && (
                        <motion.div
                            className="flex flex-wrap"
                            key="AddExpenseSubscriptionInterval"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="flex-1 basis-auto mx-auto">
                                <input
                                    name="subscription-interval"
                                    id={`subscription-interval-unset`}
                                    placeholder="Enter subscription-interval value"
                                    type="radio"
                                    defaultValue="unset"
                                    defaultChecked={!subscriptionInterval}
                                    className="mr-1"
                                />
                                <label htmlFor={`subscription-interval-unset`}>
                                    unset
                                </label>
                            </div>
                            {[...SUBSCRIPTION_INTERVAL.values()].map(
                                (val, index) => (
                                    <div
                                        className="flex-1 basis-auto mx-auto"
                                        key={`subscriptionInterval-${index}`}
                                    >
                                        <input
                                            name="subscription-interval"
                                            id={`subscription-interval-${val}`}
                                            placeholder="Enter subscription-interval value"
                                            type="radio"
                                            defaultValue={val}
                                            defaultChecked={
                                                subscriptionInterval === val
                                            }
                                            className="mr-1"
                                        />
                                        <label
                                            htmlFor={`subscription-interval-${val}`}
                                        >
                                            {val}
                                        </label>
                                    </div>
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div>
                <div>
                    <button
                        className="mr-2"
                        type="button"
                        onClick={() =>
                            setShowItem((prev) => ({
                                ...prev,
                                tag: !prev.tag,
                            }))
                        }
                    >
                        {showItem.tag ? <FaMinus /> : <FaPlus />}
                    </button>
                    <span className="capitalize">tags:</span>
                </div>
                <AnimatePresence>
                    {showItem.tag && (
                        <motion.div
                            className="flex flex-wrap"
                            key="AddExpenseTag"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {[...EXPENSE_TAGS.values()].map((val, index) => (
                                <fieldset
                                    className="flex-1 basis-auto mx-auto"
                                    key={`val-${index}`}
                                >
                                    <input
                                        name="tag"
                                        id={`tag-${val}`}
                                        placeholder="Enter tag value"
                                        type="radio"
                                        defaultValue={val}
                                        defaultChecked={tags?.[0] === val}
                                        className="mr-1"
                                    />
                                    <label htmlFor={`tag-${val}`}>{val}</label>
                                </fieldset>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex flex-col">
                <div>
                    <button
                        className="mr-2"
                        type="button"
                        onClick={() =>
                            setShowItem((prev) => ({
                                ...prev,
                                notes: !prev.notes,
                            }))
                        }
                    >
                        {showItem.notes ? <FaMinus /> : <FaPlus />}
                    </button>
                    <span className="capitalize">notes:</span>
                </div>
                <AnimatePresence>
                    {showItem.notes && (
                        <motion.textarea
                            name="notes"
                            id="notes"
                            placeholder="Enter notes"
                            className=""
                            key="AddExpenseNotes"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            defaultValue={notes}
                        />
                    )}
                </AnimatePresence>
            </div>
            <div className="flex justify-end gap-2">
                <SubmitButton />
                <button type="button" onClick={() => onCancel()}>
                    Cancel
                </button>
            </div>
        </motion.form>
    );
}

export default EditExpenses;
