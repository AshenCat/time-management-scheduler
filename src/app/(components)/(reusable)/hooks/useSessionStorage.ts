import { useEffect, useState } from "react";

const useSessionStorage = (key: string) => {
    const [value, setValue] = useState<string | null>(null);

    const setStorageValue = (value: string) => {
        sessionStorage.setItem(key, value);
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        setValue(sessionStorage.getItem(key));
    }, [key]);

    return [value, setStorageValue] as const;
};

export default useSessionStorage;
