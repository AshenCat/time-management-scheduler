"use client";

import Link from "next/link";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Accordion from "./(reusable)/Accordion/Accordion";
import { createQueryString } from "../(lib)/commons";
import { FaArrowLeft } from "react-icons/fa6";

function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const workoutAccordionStateQuery = searchParams.get(
        "workout-accordion-state"
    );

    const workoutAccordionState = workoutAccordionStateQuery === "true";

    const navItemSelectedClassName =
        "bg-[color:--color-p-2] text-[color:--color-s-1] flex-col";

    console.log(pathname);

    return (
        <header className="basis-48 shrink-0 h-full text-[color:--color-neutral] bg-[color:--color-s-2] relative">
            <h2 className="underline underline-offset-8 p-4 text-xl content-baseline flex justify-between">
                <Link href="/">
                    <span className="underline decoration-indigo-500">
                        Cat&apos;s
                    </span>{" "}
                    Personal
                </Link>
                <button className="basis-3 bg-[color:--color-s-2]">
                    <FaArrowLeft />
                </button>
            </h2>
            <nav className="flex flex-col hover:*:bg-[color:--color-p-2] hover:*:text-[color:--color-s-1] *:flex *:text-center *:[&>*]:w-full">
                <div
                    className={
                        pathname.toLowerCase().includes("workout") ||
                        workoutAccordionState
                            ? navItemSelectedClassName
                            : ""
                    }
                >
                    <Accordion
                        open={workoutAccordionState}
                        label="Workout"
                        onClick={() => {
                            // if (!pathname.toLowerCase().endsWith("workout"))
                            router.push(
                                "?" +
                                    createQueryString(
                                        "workout-accordion-state",
                                        JSON.stringify(!workoutAccordionState)
                                    )
                            );
                        }}
                    >
                        <div className="flex flex-col">
                            {[
                                "bicep",
                                "tricep",
                                "shoulder",
                                "chest",
                                "back",
                                "core",
                                "leg",
                            ].map((item, index) => (
                                <Link
                                    href={`/workout/${item}?`}
                                    key={`item-${index}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:scale-110 p-4 capitalize"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </Accordion>
                </div>

                <div
                    className={
                        pathname.toLowerCase().includes("calendar")
                            ? navItemSelectedClassName
                            : ""
                    }
                >
                    <Link href="/calendar">Calendar</Link>
                </div>
            </nav>
        </header>
    );
}

export default Sidebar;
