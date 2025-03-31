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
    subscriptionInterval?: (typeof SUBSCRIPTION_INTERVAL)[number];
    date?: Date;
    tags?: string[];
    notes?: string;
}

interface LeanExpenseWithId extends ExpenseAttrs {
    _id: string;
    __v?: number;
}
