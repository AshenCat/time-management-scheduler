"use client";
import React, { PropsWithChildren } from "react";
import { FaSquareXmark } from "react-icons/fa6";
import { motion } from "motion/react";
import { v4 } from "uuid";

interface IModal extends PropsWithChildren {
    open: boolean;
    setOpen: (bool: boolean) => void;
    options?: {
        header: boolean;
    };
    title?: string;
    modalClassName?: string;
}

function Modal({
    children,
    open,
    setOpen,
    options,
    modalClassName,
    title,
}: IModal) {
    return (
        <motion.article
            className="absolute left-0 right-0 top-0 bottom-0 bg-gray-500/75 flex justify-center items-center text-black cursor-default"
            style={{ display: open ? "flex" : "none" }}
            onClick={() => setOpen(false)}
            role="button"
            tabIndex={0}
            key={v4()}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div
                className={`bg-neutral-200 p-4 shrink-0 ` + modalClassName}
                onClick={(e) => e.stopPropagation()}
            >
                {options?.header ?? (
                    <header className="flex justify-between mb-3 text-xl">
                        <h3 className="">{title}</h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                            }}
                            className="hover:text-(--color-s-2)"
                        >
                            <FaSquareXmark />
                        </button>
                    </header>
                )}
                <hr className="border-neutral-300" />
                <>{children}</>
            </div>
        </motion.article>
    );
}

export default Modal;
