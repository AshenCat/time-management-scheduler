import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useDebounce<T>(
    defaultValue: T | undefined = undefined,
    delay = 350
) {
    const [keyword, setKeyword] = useState<T | undefined>(defaultValue);
    const [keywordQuery, setKeywordQuery] = useState<T | undefined>(
        defaultValue
    );

    useEffect(() => {
        const delayFn = setTimeout(() => setKeyword(keywordQuery), delay);
        return () => clearTimeout(delayFn);
    }, [keywordQuery, delay]);

    return [keyword, setKeywordQuery, keywordQuery] as [
        T,
        Dispatch<SetStateAction<T>>,
        T
    ];
}
