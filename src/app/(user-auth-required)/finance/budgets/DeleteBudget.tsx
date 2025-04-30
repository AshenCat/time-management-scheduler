"use client";
import { deleteBudget } from "@/app/actions";
import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";

const initialState = {
    message: null as null | string,
    timestamp: null as null | number,
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            className="flex-1 px-4 transition-all bg-red-400 hover:bg-red-600"
            type="submit"
            aria-disabled={pending}
        >
            DELETE
        </button>
    );
};
function DeleteBudget({ budgetId }: { budgetId: string }) {
    const [state, deleteBudgetAction] = useActionState(
        deleteBudget,
        initialState
    );

    useEffect(() => {
        const { message } = state;
        if (message?.includes("Success")) toast.success(message);
        if (message?.includes("Error")) toast.error(message);
    }, [state]);

    return (
        <form action={deleteBudgetAction} className="flex flex-1">
            <input type="hidden" defaultValue={budgetId} name="budgetId" />
            <SubmitButton />
        </form>
    );
}

export default DeleteBudget;
