"use server";

import dayjs from "dayjs";
import { EXPENSE_TAGS, isInConst, SUBSCRIPTION_INTERVAL } from "./(db)/common";
import Expense from "./(db)/models/expense.model";
import { connectDB } from "./(db)/mongodb";
import Util from "util";
import { checkIfStringNull, isStringEmptyOrNullish } from "./(lib)/commons";
import { printError } from "./(lib)/error-commons";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

export async function getExpenses({
    userId,
    from,
    to,
}: {
    userId: string;
    from?: string;
    to?: string;
}) {
    try {
        if (from) {
            if (isStringEmptyOrNullish(to)) {
                throw new Error("filters from and to must be exclusively set");
            }
        }
        if (to) {
            if (isStringEmptyOrNullish(from)) {
                throw new Error("filters from and to must be exclusively set");
            }
        }
        await connectDB();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query = { userId } as FilterQuery<{ [key: string]: any }>;

        if (from) {
            query.date = { $gte: from, $lt: to };
        }

        const expenses = await Expense.find(query).lean();
        return JSON.stringify(expenses);
    } catch (err) {
        printError("getExpenses", err as Error);
        throw err;
    }
}

export async function addExpense(
    prevState: { message: string | null; timestamp: number | null },
    formData: FormData
) {
    const cost = Number(formData.get("cost"));
    const name = checkIfStringNull(String(formData.get("name")));
    const subscriptionInterval = checkIfStringNull(
        String(formData.get("subscription-interval"))
    );
    const userId = checkIfStringNull(String(formData.get("userId")));
    const date = checkIfStringNull(String(formData.get("date")));
    const notes = checkIfStringNull(String(formData.get("notes")));
    const tag = checkIfStringNull(String(formData.get("tag")));

    const newExpenseObj: { [key: string]: string | number | [string] | null } =
        {};

    if (!cost || isNaN(cost) || cost < 1)
        return {
            message: "Error: entered cost invalid",
            timestamp: Date.now(),
        };
    newExpenseObj.cost = cost;

    if (!name || name.trim() === "")
        return {
            message: "Error: entered name invalid",
            timestamp: Date.now(),
        };
    newExpenseObj.name = name;

    if (!isInConst(subscriptionInterval, SUBSCRIPTION_INTERVAL)) {
        if (subscriptionInterval && subscriptionInterval !== "unset") {
            return {
                message: "Error: entered subscriptionInterval invalid",
                timestamp: Date.now(),
            };
        }
    }
    newExpenseObj.subscriptionInterval = isInConst(
        subscriptionInterval,
        SUBSCRIPTION_INTERVAL
    )
        ? subscriptionInterval
        : null;

    if (!userId || userId.trim() === "") {
        return {
            message: "Error: something went wrong",
            timestamp: Date.now(),
        };
    }
    newExpenseObj.userId = userId;

    if (!dayjs(date).isValid()) {
        return {
            message: "Error: entered date invalid",
            timestamp: Date.now(),
        };
    }
    newExpenseObj.date = date;

    // no check for notes
    newExpenseObj.notes = notes;

    if (!isInConst(tag, EXPENSE_TAGS) && tag) {
        return { message: "Error: entered tag invalid", timestamp: Date.now() };
    }
    newExpenseObj.tags = isInConst(tag, EXPENSE_TAGS) ? [tag] : null;

    console.log(Util.inspect(newExpenseObj, false, null, true));

    try {
        await connectDB();

        const newExpense = new Expense(newExpenseObj);
        await newExpense.save();

        revalidatePath("/finance");
        return { message: `Success: Expense added!`, timestamp: Date.now() };
    } catch (err) {
        printError("addExpense", err as Error);
        return {
            message: "Error: Something went wrong.",
            timestamp: Date.now(),
        };
    }
}

export async function editExpense(
    prevState: { message: string | null },
    formData: FormData
) {
    const cost = Number(formData.get("cost"));
    const name = checkIfStringNull(String(formData.get("name")));
    const subscriptionInterval = checkIfStringNull(
        String(formData.get("subscription-interval"))
    );
    const userId = checkIfStringNull(String(formData.get("userId")));
    const expenseId = checkIfStringNull(String(formData.get("expenseId")));
    const date = checkIfStringNull(String(formData.get("date")));
    const notes = checkIfStringNull(String(formData.get("notes")));
    const tag = checkIfStringNull(String(formData.get("tag")));

    for (const val of formData.entries()) {
        console.log(val);
    }

    const editExpenseObj: { [key: string]: string | number | [string] | null } =
        {};

    if (!cost || isNaN(cost) || cost < 1)
        return {
            message: "Error: entered cost invalid",
            timestamp: Date.now(),
        };
    editExpenseObj.cost = cost;

    if (!name || name.trim() === "")
        return {
            message: "Error: entered name invalid",
            timestamp: Date.now(),
        };
    editExpenseObj.name = name;

    if (!isInConst(subscriptionInterval, SUBSCRIPTION_INTERVAL)) {
        if (subscriptionInterval && subscriptionInterval !== "unset") {
            return {
                message: "Error: entered subscriptionInterval invalid",
                timestamp: Date.now(),
            };
        }
    }
    editExpenseObj.subscriptionInterval = isInConst(
        subscriptionInterval,
        SUBSCRIPTION_INTERVAL
    )
        ? subscriptionInterval
        : null;

    if (!expenseId || expenseId.trim() === "") {
        return {
            message: "Error: something went wrong",
            timestamp: Date.now(),
        };
    }

    if (!userId || userId.trim() === "") {
        return {
            message: "Error: something went wrong",
            timestamp: Date.now(),
        };
    }

    if (!dayjs(date).isValid()) {
        return {
            message: "Error: entered date invalid",
            timestamp: Date.now(),
        };
    }
    editExpenseObj.date = date;

    // no check for notes
    editExpenseObj.notes = notes;

    if (!isInConst(tag, EXPENSE_TAGS) && tag) {
        return { message: "Error: entered tag invalid", timestamp: Date.now() };
    }
    editExpenseObj.tags = isInConst(tag, EXPENSE_TAGS) ? [tag] : null;

    console.log(Util.inspect(editExpenseObj, false, null, true));

    try {
        await connectDB();

        await Expense.findByIdAndUpdate(
            { _id: expenseId, userId },
            editExpenseObj
        );

        revalidatePath("/finance");
        return { message: `Success: Expense edited!`, timestamp: Date.now() };
    } catch (err) {
        printError("editExpense", err as Error);
        return {
            message: "Error: Something went wrong.",
            timestamp: Date.now(),
        };
    }
}

export async function deleteExpense(
    prevState: { message: string | null },
    formData: FormData
) {
    const userId = checkIfStringNull(String(formData.get("userId")));
    const expenseId = checkIfStringNull(String(formData.get("expenseId")));

    if (isStringEmptyOrNullish(expenseId) || isStringEmptyOrNullish(userId)) {
        throw new Error("invalid expenseId");
    }
    try {
        await connectDB();

        const deletedExpense = await Expense.findOne({
            _id: expenseId,
            userId,
        });

        if (!deletedExpense) {
            throw new Error("invalid document");
        }

        // console.log("DELETED=======");
        // console.log(deletedExpense);
        await deletedExpense.deleteOne();

        revalidatePath("/finance");

        return {
            message: `Successfully Deleted item: ${deletedExpense._id}\n${deletedExpense.name} - ${deletedExpense.cost}`,
        };
    } catch (err) {
        printError("getExpenses", err as Error);
        return { message: "Error: Something went wrong." };
    }
}
