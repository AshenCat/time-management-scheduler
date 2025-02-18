"use client";

import Link from "next/link";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Accordion from "./(reusable)/Accordion/Accordion";
import { createQueryString } from "../(lib)/commons";

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
        <header className="w-fit h-full bg-[color:--color-s-2] text-[color:--color-neutral]">
            <h2 className="underline underline-offset-8 p-4">
                <Link href="/">
                    <span className="underline decoration-indigo-500">
                        Cat&apos;s
                    </span>{" "}
                    Personal
                </Link>
            </h2>
            <nav className="flex flex-col hover:*:bg-[color:--color-p-2] hover:*:text-[color:--color-s-1] *:flex *:text-center *:[&>*]:w-full">
                <div
                    className={
                        pathname.toLowerCase().includes("workout")
                            ? navItemSelectedClassName
                            : ""
                    }
                >
                    <Accordion
                        open={workoutAccordionState}
                        label="Workout"
                        onClick={() => {
                            if (!pathname.toLowerCase().endsWith("workout"))
                                router.push(
                                    "/workout?" +
                                        createQueryString(
                                            "workout-accordion-state",
                                            JSON.stringify(
                                                !workoutAccordionState
                                            )
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
