import mongoose, { Schema } from "mongoose";
import { requiredString, subscriptionInterval } from "../common";

// type subscriptionIntervalType = (typeof subscriptionInterval)[number];

interface ExpenseAttrs {
    cost: number;
    name: string;
    subscriptionInterval?: string;
    date?: Date;
    notes?: string;
}

interface ExpenseDoc extends mongoose.Document {
    cost: number;
    name: string;
    subscriptionInterval?: string;
    date?: Date;
    notes?: string;
}

interface ExpenseModel extends mongoose.Model<ExpenseDoc> {
    build(attrs: ExpenseAttrs): ExpenseDoc;
}

const expenseSchema = new Schema({
    cost: {
        type: Number,
        required: true,
    },
    name: requiredString,
    subscriptionInterval: {
        type: String,
        enum: subscriptionInterval,
    },
    date: {
        type: Date,
    },
    notes: String,
});

expenseSchema.statics.build = (attrs: ExpenseAttrs) => {
    return new Expense(attrs);
};

const Expense = mongoose.model<ExpenseDoc, ExpenseModel>(
    "Expense",
    expenseSchema
);

export { Expense };

export type { ExpenseAttrs, ExpenseDoc };
