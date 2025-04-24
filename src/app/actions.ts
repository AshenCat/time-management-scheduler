"use server";

import dayjs from "dayjs";
import {
    arrayIsInConst,
    EXPENSE_TAGS,
    isInConst,
    INTERVAL,
} from "./(db)/common";
import Expense from "./(db)/models/expense.model";
import { connectDB } from "./(db)/mongodb";
import Util from "util";
import { checkIfStringNull, isStringEmptyOrNullish } from "./(lib)/commons";
import { printError } from "./(lib)/error-commons";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import Income from "./(db)/models/income.model";
import Budget from "./(db)/models/budget.model";
import { redirect } from "next/navigation";

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
        const query = {
            $or: [
                {
                    deleted: false,
                },
                {
                    deleted: undefined,
                },
            ],
            $and: [{ userId }],
        } as FilterQuery<{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        }>;

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
    const tags = checkIfStringNull(String(formData.get("tags")));

    const newExpenseObj: {
        [key: string]: string | number | string[] | boolean | null;
    } = {};

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

    if (!isInConst(subscriptionInterval, INTERVAL)) {
        if (subscriptionInterval && subscriptionInterval !== "unset") {
            return {
                message: "Error: entered subscriptionInterval invalid",
                timestamp: Date.now(),
            };
        }
    }
    newExpenseObj.subscriptionInterval = isInConst(
        subscriptionInterval,
        INTERVAL
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

    if (
        !subscriptionInterval &&
        subscriptionInterval === "unset" &&
        !dayjs(date).isValid()
    ) {
        return {
            message: "Error: entered date invalid",
            timestamp: Date.now(),
        };
    }
    newExpenseObj.date = date;

    // no check for notes
    newExpenseObj.notes = notes;

    if (tags && !arrayIsInConst(tags.split(","), EXPENSE_TAGS)) {
        return { message: "Error: entered tag invalid", timestamp: Date.now() };
    }
    newExpenseObj.tags = tags?.split(",") ?? null;

    console.log(Util.inspect(newExpenseObj, false, null, true));

    try {
        await connectDB();

        const newExpense = new Expense(newExpenseObj);
        await newExpense.save();

        // revalidatePath("/finance");
        redirect('/finances/expenses')
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
    const tags = checkIfStringNull(String(formData.get("tags")));

    // for (const val of formData.entries()) {
    //     console.log(val);
    // }

    const editExpenseObj: { [key: string]: string | number | string[] | null } =
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

    if (!isInConst(subscriptionInterval, INTERVAL)) {
        if (subscriptionInterval && subscriptionInterval !== "unset") {
            return {
                message: "Error: entered subscriptionInterval invalid",
                timestamp: Date.now(),
            };
        }
    }
    editExpenseObj.subscriptionInterval = isInConst(
        subscriptionInterval,
        INTERVAL
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

    if (
        (!subscriptionInterval || subscriptionInterval === "unset") &&
        !dayjs(date).isValid()
    ) {
        return {
            message: "Error: entered date invalid",
            timestamp: Date.now(),
        };
    }
    editExpenseObj.date = date;

    // no check for notes
    editExpenseObj.notes = notes;

    // if (!arrayIsInConst(tags, EXPENSE_TAGS) && tags) {
    //     return {
    //         message: "Error: entered tags invalid",
    //         timestamp: Date.now(),
    //     };
    // }
    if (tags && !arrayIsInConst(tags.split(","), EXPENSE_TAGS)) {
        return { message: "Error: entered tag invalid", timestamp: Date.now() };
    }
    editExpenseObj.tags = tags?.split(",") ?? null;

    // console.log(Util.inspect(editExpenseObj, false, null, true));

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

// Changed from actually deleting to toggling deleted expenses
export async function deleteExpense(
    prevState: { message: string | null; timestamp: null | number },
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

        // await deletedExpense.deleteOne();

        deletedExpense.set("deleted", true);

        await deletedExpense.save();

        // const result = await Expense.findOneAndUpdate(
        //     { _id: expenseId, userId },
        //     { deleted: true },
        //     { new: true, upsert: true }
        // );

        // console.log(result);

        revalidatePath("/finance");

        return {
            message: `Successfully Deleted item`,
            timestamp: Date.now(),
        };
    } catch (err) {
        printError("getExpenses", err as Error);
        return {
            message: "Error: Something went wrong.",
            timestamp: Date.now(),
        };
    }
}

/*********************************************************************************
 *
 *
 *
 * END OF EXPENSES
 *
 *
 *
 *********************************************************************************/

export async function getIncome({
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
        const query = {
            $or: [
                {
                    deleted: false,
                },
                {
                    deleted: undefined,
                },
            ],
            $and: [{ userId }],
        } as FilterQuery<{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        }>;

        if (from) {
            query.date = { $gte: from, $lt: to };
        }

        const income = await Income.find(query).lean();
        return JSON.stringify(income);
    } catch (err) {
        printError("getIncome", err as Error);
        throw err;
    }
}

export async function addIncome(
    prevState: { message: string | null; timestamp: null | number },
    formData: FormData
) {
    const amount = Number(formData.get("amount"));
    const name = checkIfStringNull(String(formData.get("name")));
    const payInterval = checkIfStringNull(String(formData.get("pay-interval")));
    const userId = checkIfStringNull(String(formData.get("userId")));
    const notes = checkIfStringNull(String(formData.get("notes")));

    const newIncomeObj: {
        [key: string]: string | number | string[] | boolean | null;
    } = {};

    if (!amount || isNaN(amount) || amount < 1)
        return {
            message: "Error: entered amount invalid",
            timestamp: Date.now(),
        };
    newIncomeObj.amount = amount;

    if (!name || name.trim() === "")
        return {
            message: "Error: entered name invalid",
            timestamp: Date.now(),
        };
    newIncomeObj.name = name;

    if (!isInConst(payInterval, INTERVAL)) {
        if (payInterval && payInterval !== "unset") {
            return {
                message: "Error: entered payInterval invalid",
                timestamp: Date.now(),
            };
        }
    }
    newIncomeObj.payInterval = isInConst(payInterval, INTERVAL)
        ? payInterval
        : null;

    if (!userId || userId.trim() === "") {
        return {
            message: "Error: something went wrong",
            timestamp: Date.now(),
        };
    }
    newIncomeObj.userId = userId;

    newIncomeObj.notes = notes;

    console.log(Util.inspect(newIncomeObj, false, null, true));

    try {
        await connectDB();

        const newIncome = new Income(newIncomeObj);
        await newIncome.save();

        revalidatePath("/finance");
        return { message: `Success: Income added!`, timestamp: Date.now() };
    } catch (err) {
        printError("addIncome", err as Error);
        return {
            message: "Error: Something went wrong.",
            timestamp: Date.now(),
        };
    }
}

/*********************************************************************************
 *
 *
 *
 * END OF INCOME
 *
 *
 *
 *********************************************************************************/

export async function getBudget({ userId }: { userId: string }) {
    try {
        await connectDB();

        const budgetList = await Budget.find({ userId }).lean();

        return JSON.stringify(budgetList);
    } catch (err) {
        printError("getExpenses", err as Error);
        throw err;
    }
}

export async function addBudget(
    prevState: { message: string | null; timestamp: null | number },
    formData: FormData
) {
    const amount = Number(formData.get("amount"));
    const name = checkIfStringNull(String(formData.get("name")));
    const budgetInterval = checkIfStringNull(String(formData.get("interval")));
    const userId = checkIfStringNull(String(formData.get("userId")));
    const notes = checkIfStringNull(String(formData.get("notes")));

    const newBudgetObj: {
        [key: string]: string | number | string[] | boolean | null;
    } = {};

    if (!amount || isNaN(amount) || amount < 1)
        return {
            message: "Error: entered amount invalid",
            timestamp: Date.now(),
        };
    newBudgetObj.amount = amount;

    if (!name || name.trim() === "")
        return {
            message: "Error: entered name invalid",
            timestamp: Date.now(),
        };
    newBudgetObj.name = name;

    if (!isInConst(budgetInterval, INTERVAL)) {
        if (budgetInterval && budgetInterval !== "unset") {
            return {
                message: "Error: entered budgetInterval invalid",
                timestamp: Date.now(),
            };
        }
    }
    newBudgetObj.budgetInterval = isInConst(budgetInterval, INTERVAL)
        ? budgetInterval
        : null;

    if (!userId || userId.trim() === "") {
        return {
            message: "Error: something went wrong",
            timestamp: Date.now(),
        };
    }
    newBudgetObj.userId = userId;

    newBudgetObj.notes = notes;

    console.log(Util.inspect(newBudgetObj, false, null, true));

    try {
        await connectDB();

        const newBudget = new Budget(newBudgetObj);
        await newBudget.save();

        revalidatePath("/finance");
        return { message: `Success: Budget added!`, timestamp: Date.now() };
    } catch (err) {
        printError("addBudget", err as Error);
        return {
            message: "Error: Something went wrong.",
            timestamp: Date.now(),
        };
    }
}