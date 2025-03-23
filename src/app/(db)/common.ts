export const requiredString = {
    type: String,
    required: true,
};

export const subscriptionInterval = [
    "weekly",
    "bi-weekly",
    "monthly",
    "quarterly",
    "bi-yearly",
    "yearly",
    "custom",
] as const;
