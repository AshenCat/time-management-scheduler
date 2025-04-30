"use client";
import { deleteIncome } from "@/app/actions";
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
function DeleteIncome({
    incomeId,
}: {
    incomeId: string;
}) {
    const [state, deleteIncomeAction] = useActionState(
        deleteIncome,
        initialState
    );

    useEffect(() => {
        const { message } = state;
        if (message?.includes("Success")) toast.success(message);
        if (message?.includes("Error")) toast.error(message);
    }, [state]);

    return (
        <form action={deleteIncomeAction} className="flex flex-1">
            <input type="hidden" defaultValue={incomeId} name="incomeId" />
            <SubmitButton />
        </form>
    );
}

export default DeleteIncome;
