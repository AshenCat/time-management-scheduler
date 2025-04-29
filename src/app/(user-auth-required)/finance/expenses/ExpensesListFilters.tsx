"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { v4 } from "uuid";
import { FaArrowDown, FaArrowUp, FaMagnifyingGlass } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/(components)/(reusable)/hooks/useDebounce";
import Select from "react-select";
import { useIsMount } from "@/app/(components)/(reusable)/hooks/useIsMount";
import { EXPENSE_TAGS } from "@/app/(db)/common";

function ExpensesListFilters() {
    //     {
    //     sortIsToggled,
    //     setSortIsToggled,
    // }: {
    //     sortIsToggled: boolean;
    //     setSortIsToggled: Dispatch<SetStateAction<boolean>>;
    // }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row">
                <SortToggleButton />
            </div>
            <div className="flex">
                <KeywordSearchBar />
                <FaMagnifyingGlass />
            </div>
        </div>
    );
}

const KeywordSearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isMount = useIsMount();

    const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useDebounce<string>("");

    const defaultVal = searchParams.get("searchKeyword") ?? "";

    useEffect(() => {
        if (!isMount) {
            const nextSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            nextSearchParams.set("searchKeyword", debouncedSearchKeyword);
            if (debouncedSearchKeyword !== "")
                router.replace(
                    "/finance/expenses?" + nextSearchParams.toString()
                );
            else {
                nextSearchParams.delete("searchKeyword");
                router.replace(
                    "/finance/expenses?" + nextSearchParams.toString()
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchKeyword]);

    return (
        <input
            type="text"
            className="text-black p-2"
            defaultValue={defaultVal}
            // value={searchKeyword}
            onChange={(e) => setDebouncedSearchKeyword(e.target.value)}
            placeholder="Enter keyword..."
        />
    );
};

const SearchByTags = () => {
    return (
        <Select
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
        />
    );
};

const SortToggleButton = () => {
    const searchParams = useSearchParams();
    const isMount = useIsMount();
    const router = useRouter();

    const [isToggled, setIsToggled] = useState<1 | -1>(1);

    const [sortBy, setSortBy] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!isMount) {
            const nextSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            nextSearchParams.set("sort", `${sortBy},${isToggled}`);
            if (sortBy && sortBy !== "")
                router.replace(
                    "/finance/expenses?" + nextSearchParams.toString()
                );
            else {
                nextSearchParams.delete("sort");
                router.replace(
                    "/finance/expenses?" + nextSearchParams.toString()
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, isToggled]);

    return (
        <div className="flex gap-2 justify-center items-center">
            <Select
                className="flex-1 text-black"
                placeholder="Sort By..."
                aria-label="Sort By filter"
                instanceId="ExpenseList-SortBy-Filter"
                options={[
                    { value: "", label: " " },
                    { value: "cost", label: "cost" },
                    { value: "name", label: "name" },
                ]}
                onChange={(e) => setSortBy(e?.value)}
            />
            <button
                className="relative text-base"
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setIsToggled((prev) => (prev * -1) as 1 | -1);
                }}
            >
                <AnimatePresence mode="popLayout">
                    {isToggled > 0 ? (
                        <motion.span
                            className="text-center"
                            exit={{ opacity: 0, left: 20 }}
                            initial={{ opacity: 0, right: 20 }}
                            animate={{ opacity: 1, left: 0, right: 0 }}
                            key={v4()}
                        >
                            <FaArrowUp />
                        </motion.span>
                    ) : (
                        <motion.span
                            // className="absolute"
                            exit={{ opacity: 0, left: 20 }}
                            initial={{ opacity: 0, right: 20 }}
                            animate={{ opacity: 1, left: 0, right: 0 }}
                            key={v4()}
                        >
                            <FaArrowDown />
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
};

export default ExpensesListFilters;
