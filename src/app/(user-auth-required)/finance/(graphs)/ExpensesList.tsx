import { ExpenseAttrs } from "@/app/(db)/models/expense.model";
import React from "react";

function ExpensesList({ expenses }: { expenses: ExpenseAttrs[] }) {
    return (
        <div>
            <h1>Expenses</h1>
            {expenses.map((expense, index) => (
                <div key={expense.name + index}>
                    {expense.name} - {expense.cost}
                </div>
            ))}
        </div>
    );
}

export default ExpensesList;
