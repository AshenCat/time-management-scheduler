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
