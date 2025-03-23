"use client";
// import { animate, inView } from "motion";
import React, {
    PropsWithChildren,
    ReactNode,
    useState,
} from "react";

interface IDropdownProps extends PropsWithChildren {
    className?: React.ComponentProps<"div">["className"];
    popUpClassName?: React.ComponentProps<"div">["className"];
    options: ReactNode[];
}

function Dropdown({
    children,
    options,
    className,
    popUpClassName,
}: IDropdownProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`relative flex items-center ${className || ""}`}>
            <button onClick={() => setIsExpanded((prev) => !prev)}>
                {children}
            </button>
            {isExpanded && (
                <div
                    className={`absolute w-full rounded-sm dropdown-bg bottom-[110%] transition-all ${
                        popUpClassName || ""
                    }`}
                >
                    <ul className="p-2 hover:opacity-80 text-center">
                        {options.map((option) => option)}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
