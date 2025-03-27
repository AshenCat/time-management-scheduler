export const requiredString = {
    type: String,
    required: true,
};

export const SUBSCRIPTION_INTERVAL = [
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
] as const;

/**
 *
 * @param values const array source
 * @param val value to look out for
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isInConst<T>(val: any, values: readonly T[]): val is T {
    return values.includes(val);
}
