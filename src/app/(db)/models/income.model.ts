import mongoose, { Schema } from "mongoose";
import { requiredString, INTERVAL } from "../common";

interface IncomeDoc extends mongoose.Document {
    amount: number;
    name: string;
    userId: string;
    payInterval?: (typeof INTERVAL)[number];
    deductions?: [];
    notes?: string;
    deleted?: boolean;
}

const incomeSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        name: requiredString,
        userId: requiredString,
        payInterval: {
            type: String,
            enum: [...INTERVAL.values()],
        },
        deductions: [
            {
                amount: {
                    type: Number,
                    required: true,
                },
                notes: String,
            },
        ],
        notes: String,
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Income = () =>
    mongoose.model<IncomeDoc, mongoose.Model<IncomeDoc>>(
        "Income",
        incomeSchema
    );

export default (mongoose.models.Income || Income()) as ReturnType<
    typeof Income
>;

export type { IncomeDoc };
