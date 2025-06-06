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
import { FilterQuery, Types } from "mongoose";
import Income from "./(db)/models/income.model";
import Budget from "./(db)/models/budget.model";
import { redirect } from "next/navigation";
import { auth } from "../../auth";

/*********************************************************************************
 *
 *
 *
 * START OF EXPENSES
 *
 *
 *
 *********************************************************************************/

export async function getExpenses({
    from,
    to,
    sort,
    searchKeyword,
    deleted,
    skip,
    limit,
    queryTags,
}: {
    from?: Date;
    to?: Date;
    sort?: string;
    searchKeyword?: string;
    deleted?: "only" | "include" | undefined;
    skip?: number;
    limit?: number;
    queryTags?: string;
}) {
    try {
        const session = await auth();

        const userId = session?.user.id;

        if (!session) throw new Error("Unauthorized");

        const query = {
            $and: [{ userId }],
        } as FilterQuery<{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        }>;

        if (!deleted)
            query.$and = [
                ...(query.$and ?? []),
                {
                    $or: [
                        {
                            deleted: false,
                        },
                        {
                            deleted: undefined,
                        },
                    ],
                },
            ];
        else if (deleted === "only") {
            query.deleted = true;
        }
        // if deleted === 'include', we just dont set it on the query itself
        if (from) query.date = { ...{ $gte: from } };
        if (to) query.date = { $lte: to, ...query.date };

        if (queryTags && queryTags !== "") {
            const qt = queryTags.split(",");
            query.$and = [
                ...(query.$and ?? []),
                {
                    tags: { $in: qt },
                },
            ];
        }

        const sortQuery = {} as {
            [key: string]: 1 | -1;
        };

        // console.log("sort========");
        // console.log(sort);

        if (sort && sort.trim() !== "") {
            const sortEntry = sort.split(",");
            if (sortEntry.length > 1) {
                sortQuery[sortEntry[0]] = Number(sortEntry[1]) as 1 | -1;
            }
            // console.log("sortQuery");
            // console.log(sortQuery);
        }

        // KEYWORD SEARCH
        // console.log("KEYWORD");
        // console.log(searchKeyword);
        if (searchKeyword && searchKeyword.trim() !== "") {
            const schemaFields = Object.keys(Expense.schema.paths);
            const searchConditions = schemaFields
                .map((field) => {
                    if (Expense.schema.paths[field].instance === "String")
                        return {
                            [field]: { $regex: searchKeyword, $options: "i" },
                        };
                    return null;
                })
                .filter((v) => !!v);
            query.$or = [...(query.$or ?? []), ...searchConditions];
        }

        // console.log(
        //     "query====================================================================================================================="
        // );
        // console.log(query);

        await connectDB();
        const [expenses, count] = await Promise.all([
            Expense.find(query)
                .sort(sortQuery)
                .skip((skip ?? 0) * (limit ?? 5))
                .limit(limit ?? 5)
                .populate("allocation")
                .lean(),
            Expense.countDocuments(query),
        ]);

        // console.log("count");
        // console.log(count);
        return {
            expenses: JSON.stringify(expenses),
            totalItems: count,
            totalPages: Math.ceil(count / (limit ?? 5)),
        };
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

    const allocation = checkIfStringNull(String(formData.get("allocation")));
    const date = checkIfStringNull(String(formData.get("date")));
    const notes = checkIfStringNull(String(formData.get("notes")));
    const tags = checkIfStringNull(String(formData.get("tags")));

    const session = await auth();

    const userId = session?.user.id;

    if (!session) throw new Error("Unauthorized");

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
        allocation &&
        allocation.trim() !== "" &&
        allocation !== "unset" &&
        !Types.ObjectId.isValid(allocation)
    ) {
        return {
            message: "Error: something went invalid allocation",
            timestamp: Date.now(),
        };
    }
    if (allocation !== "unset") {
        newExpenseObj.allocation = allocation;
    }

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
        // return { message: `Success: Expense added!`, timestamp: Date.now() };
    } catch (err) {
        printError("addExpense", err as Error);
        return {
            message: "Error: Something went wrong.",
            timestamp: Date.now(),
        };
    }
    redirect("/finances/expenses");
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
    const allocation = checkIfStringNull(String(formData.get("allocation")));
    const expenseId = checkIfStringNull(String(formData.get("expenseId")));
    const date = checkIfStringNull(String(formData.get("date")));
    const notes = checkIfStringNull(String(formData.get("notes")));
    const tags = checkIfStringNull(String(formData.get("tags")));

    // for (const val of formData.entries()) {
    //     console.log(val);
    // }

    const session = await auth();

    const userId = session?.user.id;

    if (!session) throw new Error("Unauthorized");

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
        allocation &&
        allocation.trim() !== "" &&
        allocation !== "unset" &&
        !Types.ObjectId.isValid(allocation)
    ) {
        return {
            message: "Error: something went invalid allocation",
            timestamp: Date.now(),
        };
    }
    if (allocation !== "unset") {
        editExpenseObj.allocation = allocation;
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
    const expenseId = checkIfStringNull(String(formData.get("expenseId")));

    const session = await auth();

    const userId = session?.user.id;

    if (!session) throw new Error("Unauthorized");

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
 * START OF INCOME
 *
 *
 *
 *********************************************************************************/

export async function getIncome({
    from,
    to,
    sort,
    searchKeyword,
    deleted,
    skip,
    limit,
}: {
    from?: Date;
    to?: Date;
    sort?: string;
    searchKeyword?: string;
    deleted?: "only" | "include" | undefined;
    skip?: number;
    limit?: number;
}) {
    try {
        const session = await auth();

        const userId = session?.user.id;

        if (!session) throw new Error("Unauthorized");

        const query = {
            $and: [{ userId }],
        } as FilterQuery<{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        }>;

        if (!deleted)
            query.$and = [
                ...(query.$and ?? []),
                {
                    $or: [
                        {
                            deleted: false,
                        },
                        {
                            deleted: undefined,
                        },
                    ],
                },
            ];
        else if (deleted === "only") {
            query.deleted = true;
        }
        // if deleted === 'include', we just dont set it on the query itself
        if (from) query.date = { ...{ $gte: from } };
        if (to) query.date = { $lte: to, ...query.date };

        const sortQuery = {} as {
            [key: string]: 1 | -1;
        };

        // console.log("sort========");
        // console.log(sort);

        if (sort && sort.trim() !== "") {
            const sortEntry = sort.split(",");
            if (sortEntry.length > 1) {
                sortQuery[sortEntry[0]] = Number(sortEntry[1]) as 1 | -1;
            }
            // console.log("sortQuery");
            // console.log(sortQuery);
        }

        // KEYWORD SEARCH
        // console.log("KEYWORD");
        // console.log(searchKeyword);
        if (searchKeyword && searchKeyword.trim() !== "") {
            const schemaFields = Object.keys(Expense.schema.paths);
            const searchConditions = schemaFields
                .map((field) => {
                    if (Expense.schema.paths[field].instance === "String")
                        return {
                            [field]: { $regex: searchKeyword, $options: "i" },
                        };
                    return null;
                })
                .filter((v) => !!v);
            query.$or = [...(query.$or ?? []), ...searchConditions];
        }

        await connectDB();

        const [income, count] = await Promise.all([
            Income.find(query)
                .sort(sortQuery)
                .skip((skip ?? 0) * (limit ?? 5))
                .limit(limit ?? 5)
                .lean(),
            Income.countDocuments(query),
        ]);

        // console.log("count");
        // console.log(count);
        return {
            income: JSON.stringify(income),
            totalItems: count,
            totalPages: Math.ceil(count / (limit ?? 5)),
        };
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
    const notes = checkIfStringNull(String(formData.get("notes")));

    const session = await auth();

    const userId = session?.user.id;

    if (!session) throw new Error("Unauthorized");

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

    // console.log(Util.inspect(newIncomeObj, false, null, true));

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

export async function deleteIncome(
    prevState: { message: string | null; timestamp: null | number },
    formData: FormData
) {
    const userId = checkIfStringNull(String(formData.get("userId")));
    const incomeId = checkIfStringNull(String(formData.get("incomeId")));

    if (isStringEmptyOrNullish(incomeId) || isStringEmptyOrNullish(userId)) {
        throw new Error("invalid incomeId");
    }
    try {
        await connectDB();

        const deletedIncome = await Income.findOne({
            _id: incomeId,
            userId,
        });

        if (!deletedIncome) {
            throw new Error("invalid document");
        }

        // await deletedIncome.deleteOne();

        deletedIncome.set("deleted", true);

        await deletedIncome.save();

        revalidatePath("/finance");

        return {
            message: `Successfully Deleted item`,
            timestamp: Date.now(),
        };
    } catch (err) {
        printError("getIncome", err as Error);
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
 * START OF BUDGET
 *
 *
 *
 *********************************************************************************/

export async function getBudget({
    from,
    to,
    sort,
    searchKeyword,
    deleted,
    skip,
    limit,
}: {
    from?: Date;
    to?: Date;
    sort?: string;
    searchKeyword?: string;
    deleted?: "only" | "include" | undefined;
    skip?: number;
    limit?: number;
}) {
    try {
        const session = await auth();

        const userId = session?.user.id;

        if (!session) throw new Error("Unauthorized");

        const query = {
            $and: [{ userId }],
        } as FilterQuery<{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        }>;

        if (!deleted)
            query.$and = [
                ...(query.$and ?? []),
                {
                    $or: [
                        {
                            deleted: false,
                        },
                        {
                            deleted: undefined,
                        },
                    ],
                },
            ];
        else if (deleted === "only") {
            query.deleted = true;
        }
        // if deleted === 'include', we just dont set it on the query itself
        if (from) query.date = { ...{ $gte: from } };
        if (to) query.date = { $lte: to, ...query.date };

        const sortQuery = {} as {
            [key: string]: 1 | -1;
        };

        // console.log("sort========");
        // console.log(sort);

        if (sort && sort.trim() !== "") {
            const sortEntry = sort.split(",");
            if (sortEntry.length > 1) {
                sortQuery[sortEntry[0]] = Number(sortEntry[1]) as 1 | -1;
            }
            // console.log("sortQuery");
            // console.log(sortQuery);
        }

        // KEYWORD SEARCH
        // console.log("KEYWORD");
        // console.log(searchKeyword);
        if (searchKeyword && searchKeyword.trim() !== "") {
            const schemaFields = Object.keys(Budget.schema.paths);
            const searchConditions = schemaFields
                .map((field) => {
                    if (Budget.schema.paths[field].instance === "String")
                        return {
                            [field]: { $regex: searchKeyword, $options: "i" },
                        };
                    return null;
                })
                .filter((v) => !!v);
            query.$or = [...(query.$or ?? []), ...searchConditions];
        }

        await connectDB();

        const [budget, count] = await Promise.all([
            Budget.find(query)
                .sort(sortQuery)
                .skip((skip ?? 0) * (limit ?? 5))
                .limit(limit ?? 5)
                .lean(),
            Budget.countDocuments(query),
        ]);

        // console.log("count");
        // console.log(count);
        return {
            budget: JSON.stringify(budget),
            totalItems: count,
            totalPages: Math.ceil(count / (limit ?? 5)),
        };
    } catch (err) {
        printError("getBudget", err as Error);
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
    const notes = checkIfStringNull(String(formData.get("notes")));

    const session = await auth();

    const userId = session?.user.id;

    if (!session) throw new Error("Unauthorized");

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

    // console.log(Util.inspect(newBudgetObj, false, null, true));

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

// Changed from actually deleting to toggling deleted budget
export async function deleteBudget(
    prevState: { message: string | null; timestamp: null | number },
    formData: FormData
) {
    const budgetId = checkIfStringNull(String(formData.get("budgetId")));

    const session = await auth();

    const userId = session?.user.id;

    if (!session) throw new Error("Unauthorized");

    if (isStringEmptyOrNullish(budgetId) || isStringEmptyOrNullish(userId)) {
        throw new Error("invalid budgetId");
    }
    try {
        await connectDB();

        const deletedBudget = await Budget.findOne({
            _id: budgetId,
            userId,
        });

        if (!deletedBudget) {
            throw new Error("invalid document");
        }

        // await deletedBudget.deleteOne();

        deletedBudget.set("deleted", true);

        await deletedBudget.save();

        // const result = await Budget.findOneAndUpdate(
        //     { _id: budgetId, userId },
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
        printError("getBudgets", err as Error);
        return {
            message: "Error: Something went wrong.",
            timestamp: Date.now(),
        };
    }
}
