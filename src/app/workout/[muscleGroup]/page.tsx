import MediaCarousel from "@/app/(components)/(reusable)/MediaCarousel";
import DATA_BICEP from "@/app/(data)/(workout)/(bicep)/data-bicep";
import Link from "next/link";
import React from "react";
import { v4 } from "uuid";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ muscleGroup: string }>;
    searchParams: Promise<{ modal: string }>;
}) {
    const { muscleGroup } = await params;

    return (
        <main className="flex flex-col p-4 md:p-8 flex-grow overflow-auto">
            <h2 className="text-4xl text-[color:--color-s-1]">
                <span className="capitalize">{muscleGroup}</span> Workouts
            </h2>
            <section className="my-4 flex gap-4 flex-col md:flex-row">
                {DATA_BICEP.workouts.map((workout, index) => (
                    <WorkoutCard
                        key={v4() + index}
                        title={workout.title}
                        mediaURLs={workout.mediaURLs}
                    />
                ))}
            </section>
            <hr />
            <section className="flex justify-between gap-2 md:gap-8 flex-col-reverse md:flex-row">
                <div>
                    {DATA_BICEP.articles.map((article, index) => (
                        <article key={article.title + index} className="my-4">
                            <h3 className="text-lg">{article.title}</h3>
                            <div>
                                {article.type === "text" && article.text}
                                {article.type === "list" && (
                                    <ul className="list-disc [&>li]:ml-8 ">
                                        {article.list?.map((item, index) => (
                                            <li key={item + index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
                <aside className="my-4  md:shrink-0">
                    <MediaCarousel
                        mediaURLs={DATA_BICEP.mediaURLs}
                        height={400}
                        width={400}
                        className="relative"
                    />
                </aside>
            </section>
        </main>
    );
}

interface IWorkoutCard {
    title: string;
    mediaURLs: MediaURL[];
    description?: string;
}

function WorkoutCard({ title, mediaURLs, description }: IWorkoutCard) {
    return (
        <article className="flex flex-col border-2 border-[color:--color-s-2]">
            <Link href={`?modal-content=` + title}>
                <h3 className="text-lg p-4">{title}</h3>
            </Link>
            <MediaCarousel
                mediaURLs={mediaURLs}
                className="flex relative h-[250px] bg-white p-4"
                width={350}
                height={350}
            />
            <figcaption>{description}</figcaption>
        </article>
    );
}
