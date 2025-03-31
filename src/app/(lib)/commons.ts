import { ReadonlyURLSearchParams } from "next/navigation";

export const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);
    return params.toString();
};

export const listCurrentSearchParams = (
    searchParams: ReadonlyURLSearchParams
): string => {
    let queryString = "",
        index = 0;

    for (const [key, value] of searchParams.entries()) {
        if (index !== 0) {
            queryString += "&";
        }
        queryString += key + "=" + value;
        index++;
    }

    return queryString;
};

export const checkIfStringNull = (str: string) => {
    return str === "null" ? null : str;
};

export const isStringEmptyOrNullish = (str: string | null | undefined) => {
    return !str || str.trim() === "";
};
