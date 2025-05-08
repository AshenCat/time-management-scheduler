"use client";
import { EXPENSE_TAGS, INTERVAL } from "@/app/(db)/common";
import { editExpense } from "@/app/actions";
import { motion } from "motion/react";
import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
// import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import Select from "react-select";

const initialState = {
    message: null as null | string,
    timestamp: null as number | null,
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            className="p-2 bg-(--color-s-2) text-(--color-neutral)"
            type="submit"
            aria-disabled={pending}
        >
            Edit Expense
        </button>
    );
};

function EditExpenses({
    expense,
    removeSelectedExpense,
    budgets,
}: {
    expense: LeanExpenseWithId | null;
    removeSelectedExpense: () => void;
    budgets: LeanBudgetWithId[];
}) {
    const [state, editExpenseAction] = useActionState(
        editExpense,
        initialState
    );

    useEffect(() => {
        const { message } = state;
        if (message?.includes("Success")) {
            toast.success(message);
            removeSelectedExpense();
        }
        if (message?.includes("Error")) toast.error(message);
    }, [state, removeSelectedExpense]);

    if (!expense) {
        return <></>;
    }

    const { cost, name, subscriptionInterval, date, tags, notes, _id } =
        expense;

    return (
        <motion.form
            action={editExpenseAction}
            id="edit-expense-form"
            className="p-2 max-w-100 [&_input]:text-(--color-p-2) [&_textarea]:text-(--color-p-2)"
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
                />
            </div>
            <div className="flex flex-col">
                <div>
                    <span className="capitalize">Budget allocation:</span>
                </div>
                <div className="flex flex-wrap">
                    <Select
                        className="flex-1 text-black"
                        placeholder="Select Allocation"
                        aria-label="allocation selector"
                        instanceId="add-expense-allocation"
                        options={[
                            { value: "unset", label: "unset" },
                            ...budgets.map((val) => ({
                                value: val._id,
                                label: val.name,
                            })),
                        ]}
                        name="allocation"
                    />
                </div>
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
                        defaultValue={
                            subscriptionInterval
                                ? {
                                      value: subscriptionInterval,
                                      label: subscriptionInterval,
                                  }
                                : null
                        }
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
                        defaultValue={tags?.map((tag) => ({
                            value: tag,
                            label: tag,
                        }))}
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
                    key="editExpenseNotes"
                    defaultValue={notes}
                />
            </div>
            <div className="flex justify-end gap-2">
                <SubmitButton />
                <button type="button" onClick={() => removeSelectedExpense()}>
                    Cancel
                </button>
            </div>
        </motion.form>
    );
}

export default EditExpenses;
