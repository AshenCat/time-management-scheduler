import mongoose, { Schema } from "mongoose";
import { requiredString, SUBSCRIPTION_INTERVAL } from "../common";

// type subscriptionIntervalType = (typeof SUBSCRIPTION_INTERVAL)[number];

interface ExpenseDoc extends mongoose.Document {
    cost: number;
    name: string;
    userId: string;
    subscriptionInterval?: (typeof SUBSCRIPTION_INTERVAL)[number];
    date?: Date;
    tags?: string[];
    notes?: string;
}

const expenseSchema = new Schema({
    cost: {
        type: Number,
        required: true,
    },
    name: requiredString,
    userId: requiredString,
    subscriptionInterval: {
        type: String,
        enum: [...SUBSCRIPTION_INTERVAL.values()],
    },
    date: {
        type: Date,
    },
    tags: [String],
    notes: String,
});

const Expense = () =>
    mongoose.model<ExpenseDoc, mongoose.Model<ExpenseDoc>>(
        "Expense",
        expenseSchema
    );

export default (mongoose.models.Expense || Expense()) as ReturnType<
    typeof Expense
>;

export type { ExpenseDoc };
