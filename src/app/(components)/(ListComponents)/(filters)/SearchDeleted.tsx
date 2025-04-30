import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import { useIsMount } from "@/app/(components)/(reusable)/hooks/useIsMount";

const SearchDeleted = ({ URL }: { URL: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isMount = useIsMount();

    const defaultVal = searchParams.get("deleted") ?? "hide";

    const [deletedOption, setDeletedOption] = useState("");

    useEffect(() => {
        if (!isMount) {
            const nextSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            nextSearchParams.set("deleted", deletedOption);
            if (deletedOption !== "")
                router.replace(URL + nextSearchParams.toString());
            else {
                nextSearchParams.delete("deleted");
                router.replace(URL + nextSearchParams.toString());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletedOption]);

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <label>Deleted:</label>
            <Select
                className="flex-1 text-black"
                placeholder="Hidden"
                aria-label="Sort By filter"
                instanceId="ExpenseList-SortBy-Filter"
                defaultValue={{
                    value: defaultVal,
                    label: defaultVal === "" ? "hide" : defaultVal,
                }}
                options={[
                    { value: "", label: "hide" },
                    { value: "only", label: "only" },
                    { value: "include", label: "include" },
                ]}
                onChange={(e) => setDeletedOption(e?.value ?? "")}
            />
        </div>
    );
};

export default SearchDeleted;
