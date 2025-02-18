"use client";
import React, { PropsWithChildren } from "react";

interface IAccordionProps extends PropsWithChildren {
    label: Exclude<string, "">;
    labelClassName?: string;
    className?: string;
    overrideClassName?: boolean;
    onClick?: () => void;
    open: boolean;
}

function Accordion({
    children,
    label,
    labelClassName,
    className,
    overrideClassName,
    onClick,
    open,
}: IAccordionProps) {
    return (
        <button
            onClick={() => {
                if (onClick) onClick();
            }}
            className={
                overrideClassName
                    ? className
                    : className +
                      " [&>div]:ml-auto first:pt-4 last: pb-4 flex flex-col"
            }
        >
            <span
                className={
                    labelClassName
                        ? labelClassName
                        : "" + (open ? " mb-4" : "") + " mx-auto"
                }
            >
                {label}
            </span>
            {open && children}
        </button>
    );
}

export default Accordion;
