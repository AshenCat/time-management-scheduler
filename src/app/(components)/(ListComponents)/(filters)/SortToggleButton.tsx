import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { v4 } from "uuid";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import { useIsMount } from "@/app/(components)/(reusable)/hooks/useIsMount";

const SortToggleButton = ({ URL }: { URL: string }) => {
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
                router.replace(URL + nextSearchParams.toString());
            else {
                nextSearchParams.delete("sort");
                router.replace(URL + nextSearchParams.toString());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, isToggled]);

    return (
        <div className="flex justify-center items-center gap-2">
            <label>Sort By:</label>
            <div className="flex justify-center items-center h-full bg-white rounded">
                <Select
                    className="flex-1 text-black"
                    placeholder="Sort By..."
                    aria-label="Sort By filter"
                    instanceId="ExpenseList-SortBy-Filter"
                    options={[
                        { value: "", label: "-----" },
                        { value: "cost", label: "cost" },
                        { value: "name", label: "name" },
                    ]}
                    onChange={(e) => setSortBy(e?.value)}
                />
                <button
                    className="relative text-base bg-white h-full px-4 rounded"
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
        </div>
    );
};

export default SortToggleButton;
