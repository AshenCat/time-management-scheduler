"use client";
import React from "react";
import Modal from "../(components)/(reusable)/Modal/Modal";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import MediaCarousel from "../(components)/(reusable)/MediaCarousel";
import { AnimatePresence } from "motion/react";
import { v4 } from "uuid";
import WORKOUTS from "../(data)";

function ModalHelper() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();

    const { muscleGroup } = params;

    const modalInfoStateQuery = searchParams.get("modal-content");

    const modalState = !!modalInfoStateQuery;
    // console.log("modalInfoStateQuery", modalInfoStateQuery);
    // console.log("modalState", modalState);

    // console.log(
    //     "STATE RESULT",
    //     DATA_BICEP.workouts.find((workout) => {
    //         return workout.title === modalInfoStateQuery;
    //     })?.description
    // );

    const DATA = WORKOUTS[muscleGroup as keyof typeof WORKOUTS];

    const modalData = DATA.workouts.find(
        (workout) => workout.urlParam === modalInfoStateQuery
    );

    return (
        <div className="whitespace-pre-line">
            <AnimatePresence>
                {modalState && modalData && (
                    <Modal
                        open={modalState}
                        setOpen={(_bool) => {
                            const nextSearchParams = new URLSearchParams(
                                searchParams.toString()
                            );
                            nextSearchParams.delete("modal-content");
                            router.replace(`${pathname}?${nextSearchParams}`);
                        }}
                        title={modalData.title}
                        modalClassName="w-full h-full md:w-[600px] md:max-h-3/4 flex flex-col"
                    >
                        <div className="relative flex justify-center my-3 shrink-0">
                            <MediaCarousel
                                mediaURLs={modalData.mediaURLs}
                                className="w-full"
                            />
                        </div>
                        <div className="overflow-auto">
                            <div className="mb-3">{modalData.description}</div>
                            <hr className="border-neutral-300" />

                            {modalData.articles.map((article) => (
                                <React.Fragment key={v4()}>
                                    <div className="my-3">
                                        <h3 className="text-lg">
                                            {article.title}
                                        </h3>
                                        {article.type === "list" && (
                                            <ul>
                                                {article.list?.map((item) => (
                                                    <li key={v4()}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <hr className="border-neutral-300" />
                                </React.Fragment>
                            ))}
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ModalHelper;
