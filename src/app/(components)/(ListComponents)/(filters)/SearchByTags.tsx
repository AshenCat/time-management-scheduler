import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/(components)/(reusable)/hooks/useDebounce";
import Select from "react-select";
import { useIsMount } from "@/app/(components)/(reusable)/hooks/useIsMount";
import { EXPENSE_TAGS } from "@/app/(db)/common";

const SearchByTags = ({ URL }: { URL: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isMount = useIsMount();

    const defaultVal = searchParams.get("tags") ?? "";

    const [tags, setTags] = useDebounce<string[]>([]);

    useEffect(() => {
        if (!isMount) {
            const nextSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            console.log("tags", tags);
            nextSearchParams.set("tags", tags.join(","));
            if (tags.length) router.replace(URL + nextSearchParams.toString());
            else {
                nextSearchParams.delete("tags");
                router.replace(URL + nextSearchParams.toString());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags]);
    return (
        <div className="flex flex-col sm:flex-row gap-2 items-center">
            <label>Filter Tags:</label>
            <Select
                defaultValue={
                    defaultVal
                        ? (defaultVal?.split(",") ?? []).map((v) => ({
                              label: v,
                              value: v,
                          }))
                        : undefined
                }
                className="flex-1 text-black"
                options={[...EXPENSE_TAGS].map((val) => ({
                    value: val,
                    label: val,
                }))}
                placeholder="Select tags"
                aria-label="tag selector"
                instanceId="add-expense-tag"
                name="tags"
                isMulti
                delimiter=","
                onChange={(e) => setTags(e.map((v) => v.value))}
            />
        </div>
    );
};

export default SearchByTags;
