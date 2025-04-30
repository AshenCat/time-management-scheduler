import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import { useDebounce } from "@/app/(components)/(reusable)/hooks/useDebounce";
import { useIsMount } from "@/app/(components)/(reusable)/hooks/useIsMount";

const Pagination = ({
    totalPages,
    totalCount,
    URL,
}: {
    totalPages: number;
    totalCount: number;
    URL: string;
}) => {
    const searchParams = useSearchParams();
    const skip = Number(searchParams.get("skip"))
        ? Number(searchParams.get("skip"))
        : 0;
    const limit = Number(searchParams.get("limit"))
        ? Number(searchParams.get("limit"))
        : 5;

    const isMount = useIsMount();
    const router = useRouter();
    const [debouncedPage, setDebouncedPage] = useDebounce<number>(skip ?? 0);

    useEffect(() => {
        if (!isMount) {
            const nextSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            if (debouncedPage - 1 > 0) {
                nextSearchParams.set("skip", "" + (debouncedPage - 1));
                router.replace(URL + nextSearchParams.toString());
            } else {
                nextSearchParams.delete("skip");
                router.replace(URL + nextSearchParams.toString());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMount, debouncedPage]);

    const pageItemsCountStart = limit * skip + 1;
    const pageItemsCountEnd = limit * skip + limit;

    return (
        <div className="flex flex-col md:flex-row mt-4 gap-2 justify-between">
            <div className="text-xs flex justify-center items-center">
                {`${
                    totalCount <= pageItemsCountStart
                        ? totalCount
                        : pageItemsCountStart
                } - ${
                    totalCount <= pageItemsCountEnd
                        ? totalCount
                        : pageItemsCountEnd
                }`}{" "}
                of {totalCount} items
            </div>
            <div className="flex gap-4 justify-between md:justify-end">
                <button
                    className="flex items-center disabled:cursor-not-allowed"
                    disabled={(skip ?? 0) === 0}
                    value={skip}
                    onClick={() => setDebouncedPage(skip)}
                >
                    <FaCaretLeft /> <span>Prev</span>
                </button>
                <span>
                    <input
                        type="number"
                        defaultValue={skip + 1}
                        min={1}
                        onChange={(e) =>
                            setDebouncedPage(Number(e.target.value))
                        }
                        className="w-12 p-2 text-black"
                    />
                    <span> of {totalPages} pages</span>
                </span>
                <button
                    className="flex items-center disabled:cursor-not-allowed"
                    disabled={totalCount <= pageItemsCountEnd}
                    onClick={() => setDebouncedPage(skip + 2)}
                >
                    <span>Next</span>
                    <FaCaretRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
