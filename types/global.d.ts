interface DataMuscleGroup {
    title: string;
    mediaURLs: MediaURL[];
    description: string;
    articles: Article[];
}

interface DataMuscleGroupWorkout {
    title: string;
    mediaURLs: MediaURL[];
    description: string;
    articles: Article[];
    urlParam: string;
    resources?: string[];
}

interface Article {
    title: string;
    text?: string;
    list?: string[];
    type: "text" | "list";
}

interface MediaURL {
    url: string;
    type: "image" | "video";
}

interface ExpenseAttrs {
    cost: number;
    name: string;
    userId: string;
    subscriptionInterval?: (typeof INTERVAL)[number];
    date?: Date;
    allocation?: LeanBudgetWithId;
    tags?: string[];
    notes?: string;
    deleted?: boolean;
}

interface LeanExpenseWithId extends ExpenseAttrs {
    _id: string;
    __v?: number;
}

interface IncomeAttrs {
    amount: number;
    name: string;
    userId: string;
    payInterval?: (typeof INTERVAL)[number];
    // deductions: { amount: number; notes: string }[];
    notes?: string;
    deleted?: boolean;
}

interface LeanIncomeWithId extends IncomeAttrs {
    _id: string;
    __v?: number;
}

interface BudgetAttrs {
    amount: number;
    name: string;
    userId: string;
    interval?: (typeof INTERVAL)[number];
    tags?: string[];
    notes?: string;
    deleted?: boolean;
}

interface LeanBudgetWithId extends BudgetAttrs {
    _id: string;
    __v?: number;
}
