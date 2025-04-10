export const requiredString = {
    type: String,
    required: true,
};

export const INTERVAL = [
    "weekly",
    "bi-weekly",
    "monthly",
    "quarterly",
    "bi-yearly",
    "yearly",
    "custom",
] as const;

export const EXPENSE_TAGS = [
    "food",
    "work",
    "necessity",
    "entertainment",
    "health",
    "survival",
    "grocery",
    "charity",
    "investment",
    "liquid"
] as const;

// use when checking if val is in const array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isInConst<T>(val: any, values: readonly T[]): val is T {
    return values.includes(val);
}

// use when checking if every items in val is in const array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arrayIsInConst<T>(val: any, values: readonly T[]): val is T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return val.every((v: any) => values.includes(v));
}
