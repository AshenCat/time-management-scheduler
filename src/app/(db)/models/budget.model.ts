import mongoose, { Schema } from "mongoose";
import { requiredString, INTERVAL } from "../common";

interface BudgetDoc extends mongoose.Document {
    amount: number;
    name: string;
    userId: string;
    interval?: (typeof INTERVAL)[number];
    tags?: string[];
    notes?: string;
    deleted?: boolean;
}

const budgetSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        name: requiredString,
        userId: requiredString,
        interval: {
            type: String,
            default: 'monthly',
            enum: [...INTERVAL.values()],
        },
        tags: [String],
        notes: String,
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Budget = () =>
    mongoose.model<BudgetDoc, mongoose.Model<BudgetDoc>>(
        "Budget",
        budgetSchema
    );

export default (mongoose.models.Budget || Budget()) as ReturnType<
    typeof Budget
>;

export type { BudgetDoc };
