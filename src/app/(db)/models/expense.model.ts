import mongoose, { Schema } from "mongoose";
import { requiredString, INTERVAL } from "../common";

// type subscriptionIntervalType = (typeof INTERVAL)[number];

interface ExpenseDoc extends mongoose.Document {
    cost: number;
    name: string;
    userId: string;
    subscriptionInterval?: (typeof INTERVAL)[number];
    date?: Date;
    tags?: string[];
    notes?: string;
    deleted?: boolean;
}

const expenseSchema = new Schema(
    {
        cost: {
            type: Number,
            required: true,
        },
        name: requiredString,
        userId: requiredString,
        subscriptionInterval: {
            type: String,
            enum: [...INTERVAL.values()],
        },
        date: {
            type: Date,
        },
        tags: [String],
        notes: String,
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Expense = () =>
    mongoose.model<ExpenseDoc, mongoose.Model<ExpenseDoc>>(
        "Expense",
        expenseSchema
    );

export default (mongoose.models.Expense || Expense()) as ReturnType<
    typeof Expense
>;

export type { ExpenseDoc };
