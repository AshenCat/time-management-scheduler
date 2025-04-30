import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/(components)/(reusable)/hooks/useDebounce";
import { useIsMount } from "@/app/(components)/(reusable)/hooks/useIsMount";

const KeywordSearchBar = ({ URL }: { URL: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isMount = useIsMount();

    const [debouncedSearchKeyword, setDebouncedSearchKeyword] =
        useDebounce<string>("");

    const defaultVal = searchParams.get("searchKeyword") ?? "";

    useEffect(() => {
        if (!isMount) {
            const nextSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            nextSearchParams.set("searchKeyword", debouncedSearchKeyword);
            if (debouncedSearchKeyword !== "")
                router.replace(URL + nextSearchParams.toString());
            else {
                nextSearchParams.delete("searchKeyword");
                router.replace(URL + nextSearchParams.toString());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchKeyword]);

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <label>Search Keyword:</label>
            <input
                type="text"
                className="text-black p-2 rounded"
                defaultValue={defaultVal}
                // value={searchKeyword}
                onChange={(e) => setDebouncedSearchKeyword(e.target.value)}
                placeholder="Enter keyword..."
            />
            {/* <span className="bg-white"><FaMagnifyingGlass /></span> */}
        </div>
    );
};

export default KeywordSearchBar;
