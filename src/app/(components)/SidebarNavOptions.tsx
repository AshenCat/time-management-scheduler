"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { MUSCLE_GROUPS } from "../(lib)/client-commons";
import Accordion from "./(reusable)/Accordion/Accordion";
import { createQueryString } from "../(lib)/commons";
import Link from "next/link";

function SidebarNavOptions() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const workoutAccordionStateQuery = searchParams.get(
        "workout-accordion-state"
    );

    const workoutAccordionState = workoutAccordionStateQuery === "true";

    const navItemSelectedClassName =
        "bg-[color:--color-p-2] text-[color:--color-s-1] flex-col";

    console.log("pathname");
    console.log(pathname);

    return (
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
                        {MUSCLE_GROUPS.map((item, index) => (
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
            <div
                className={
                    pathname.toLowerCase().includes("finance")
                        ? navItemSelectedClassName
                        : ""
                }
            >
                <Link href="/finance">Finance</Link>
            </div>
        </nav>
    );
}

export default SidebarNavOptions;
