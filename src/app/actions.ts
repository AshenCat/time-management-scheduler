"use server";

import dayjs from "dayjs";
import { EXPENSE_TAGS, isInConst, SUBSCRIPTION_INTERVAL } from "./(db)/common";
import Expense from "./(db)/models/expense.model";
import { connectDB } from "./(db)/mongodb";
import Util from "util";
import { checkIfStringNull } from "./(lib)/commons";
import { printError } from "./(lib)/error-commons";
import { revalidatePath } from "next/cache";

export async function addExpense(
    prevState: { message: string | null },
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
        return { message: "Error: entered cost invalid" };
    newExpenseObj.cost = cost;

    if (!name || name.trim() === "")
        return { message: "Error: entered name invalid" };
    newExpenseObj.name = name;

    if (!isInConst(subscriptionInterval, SUBSCRIPTION_INTERVAL)) {
        if (subscriptionInterval && subscriptionInterval !== "unset") {
            return { message: "Error: entered subscriptionInterval invalid" };
        }
    }
    newExpenseObj.subscriptionInterval = isInConst(
        subscriptionInterval,
        SUBSCRIPTION_INTERVAL
    )
        ? subscriptionInterval
        : null;

    if (!userId || userId.trim() === "") {
        return { message: "Error: something went wrong" };
    }
    newExpenseObj.userId = userId;

    if (!dayjs(date).isValid()) {
        return { message: "Error: entered date invalid" };
    }
    newExpenseObj.date = date;

    // no check for notes
    newExpenseObj.notes = notes;

    if (!isInConst(tag, EXPENSE_TAGS) && tag) {
        return { message: "Error: entered tag invalid" };
    }
    newExpenseObj.tags = isInConst(tag, EXPENSE_TAGS) ? [tag] : null;

    console.log(Util.inspect(newExpenseObj, false, null, true));

    try {
        await connectDB();

        const newExpense = new Expense(newExpenseObj);
        await newExpense.save();

        revalidatePath("/campaigns");
        return { message: `Success: Expense added!` };
    } catch (err) {
        printError("addExpense", err as Error);
        return { message: "Error: Something went wrong." };
    }
}
export async function getExpenses(userId: string) {
    try {
        await connectDB();
        const expenses = await Expense.find({ userId }).lean();
        return expenses;
    } catch (err) {
        printError("getExpenses", err as Error);
        throw err;
    }
}
